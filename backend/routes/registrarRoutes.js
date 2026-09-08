import express from 'express';
import { sequelize } from '../models/db.js';
import { authenticateToken, requireRegistrar } from '../middleware/auth.js';
import {
  getRegistrarStats,
  getRegistrarEnrollments,
  verifyEnrollment,
  returnEnrollment,
  approveEnrollment,
  scheduleSSCExam,
  bulkScheduleSSCExam,
  recordSSCResult,
  updateLifeStatus,
  getStudentsByLifeStatus,
} from '../controllers/registrarController.js';
import { sanitizeBody, validateRemarks, validateSSCSchedule, validateSSCResult } from '../middleware/validate.js';

const router = express.Router();

router.use(authenticateToken);
router.use(requireRegistrar);

// Dashboard
router.get('/stats', getRegistrarStats);

// Enrollment list
router.get('/enrollments', getRegistrarEnrollments);

// Verify enrollment
router.post('/enrollments/:id/verify', sanitizeBody, validateRemarks, verifyEnrollment);

// Approve enrollment
router.post('/enrollments/:id/approve', sanitizeBody, validateRemarks, approveEnrollment);

// Return enrollment to student with remarks
router.post('/enrollments/:id/return', sanitizeBody, validateRemarks, returnEnrollment);

// SSC — single schedule & result
router.put('/enrollments/:id/ssc-schedule', sanitizeBody, validateSSCSchedule, scheduleSSCExam);
router.put('/enrollments/:id/ssc-result', sanitizeBody, validateSSCResult, recordSSCResult);

// SSC — bulk schedule
router.post('/enrollments/bulk-ssc-schedule', sanitizeBody, bulkScheduleSSCExam);

// ── Student Life Status ───────────────────────────────────────────────────────
// Update a student's life status (dropped, transferred out, retained, etc.)
router.put('/enrollments/:id/life-status', sanitizeBody, updateLifeStatus);

// Get enrolled students filterable by life status
router.get('/students', getStudentsByLifeStatus);

// ── Section Transfer Requests ─────────────────────────────────────────────────
// Get all pending transfer requests
router.get('/transfer-requests', async (req, res) => {
  try {
    const [requests] = await sequelize.query(`
      SELECT er.id, er.firstName, er.familyName, er.educationLevel, er.gradeLevel,
             er.strand, er.sectionId, er.sectionName,
             er.transferRequestSectionId, er.transferRequestReason, er.transferRequestDate,
             er.studentNumber, er.lrn, er.academicYear,
             u.name AS user_name, u.email AS user_email,
             s.code AS targetSectionCode, s.course AS targetSectionCourse,
             s.yearLevel AS targetSectionYearLevel,
             s.currentEnrollment AS targetEnrolled, s.capacity AS targetCapacity
      FROM enrollment_records er
      LEFT JOIN users u ON er.userId = u.id
      LEFT JOIN sections s ON er.transferRequestSectionId = s.id
      WHERE er.transferRequestSectionId IS NOT NULL
      ORDER BY er.transferRequestDate ASC
    `);
    res.json(requests || []);
  } catch (err) {
    console.error('Get transfer requests error:', err);
    res.status(500).json({ error: 'Failed to fetch transfer requests' });
  }
});

// Approve a transfer request — moves student to requested section
router.post('/transfer-requests/:enrollmentId/approve', async (req, res) => {
  try {
    const { enrollmentId } = req.params;
    const { moveToSection } = await import('../services/sectionAssignment.js');

    const [[enrollment]] = await sequelize.query(
      'SELECT * FROM enrollment_records WHERE id = ?',
      { replacements: [enrollmentId] }
    );
    if (!enrollment) return res.status(404).json({ error: 'Enrollment not found' });
    if (!enrollment.transferRequestSectionId) {
      return res.status(400).json({ error: 'No pending transfer request for this enrollment' });
    }

    const result = await moveToSection(enrollmentId, enrollment.transferRequestSectionId);
    if (!result.success) return res.status(400).json({ error: result.reason });

    // Clear the request fields
    await sequelize.query(
      `UPDATE enrollment_records
       SET transferRequestSectionId = NULL,
           transferRequestReason = NULL,
           transferRequestDate = NULL,
           updatedAt = datetime('now')
       WHERE id = ?`,
      { replacements: [enrollmentId] }
    );

    res.json({ message: `Student transferred to Section ${result.section.code} successfully` });
  } catch (err) {
    console.error('Approve transfer error:', err);
    res.status(500).json({ error: 'Failed to approve transfer' });
  }
});

// Reject a transfer request — clears request, student stays in current section
router.post('/transfer-requests/:enrollmentId/reject', async (req, res) => {
  try {
    const { enrollmentId } = req.params;
    const { reason } = req.body;

    const [[enrollment]] = await sequelize.query(
      'SELECT * FROM enrollment_records WHERE id = ?',
      { replacements: [enrollmentId] }
    );
    if (!enrollment) return res.status(404).json({ error: 'Enrollment not found' });

    await sequelize.query(
      `UPDATE enrollment_records
       SET transferRequestSectionId = NULL,
           transferRequestReason = NULL,
           transferRequestDate = NULL,
           updatedAt = datetime('now')
       WHERE id = ?`,
      { replacements: [enrollmentId] }
    );

    res.json({ message: 'Transfer request rejected. Student remains in their current section.' });
  } catch (err) {
    console.error('Reject transfer error:', err);
    res.status(500).json({ error: 'Failed to reject transfer' });
  }
});

export default router;
