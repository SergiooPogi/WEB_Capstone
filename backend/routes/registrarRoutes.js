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

export default router;
