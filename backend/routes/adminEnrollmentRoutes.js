import express from 'express';
import {
  getAllEnrollments,
  approveEnrollment,
  rejectEnrollment,
  bulkExportPDFs,
  bulkApproveVerified,
  getEnrollmentStats,
  getArchiveByYear,
  updateEnrollmentStatus
} from '../controllers/adminEnrollmentController.js';
import { authenticateToken, requireAdmin, requireAdminOrRegistrar } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Stats and list — admin or registrar can view
router.get('/enrollments/stats', requireAdminOrRegistrar, getEnrollmentStats);
router.get('/enrollments', requireAdminOrRegistrar, getAllEnrollments);
router.post('/enrollments/bulk-export', requireAdminOrRegistrar, bulkExportPDFs);

// Archive — read-only view of past school years
router.get('/archive/:year', requireAdminOrRegistrar, getArchiveByYear);

// Bulk approve all verified enrollments — admin only
router.post('/enrollments/bulk-approve', requireAdmin, bulkApproveVerified);

// Approve/Reject/Status — admin only
router.post('/enrollments/:id/approve', requireAdmin, approveEnrollment);
router.post('/enrollments/:id/reject', requireAdmin, rejectEnrollment);
router.patch('/enrollments/:id/status', requireAdmin, updateEnrollmentStatus);

export default router;
