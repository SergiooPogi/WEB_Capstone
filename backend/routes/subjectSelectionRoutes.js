import express from 'express';
import {
  getAvailableSubjects,
  enrollSubjects,
  getEnrolledSubjects,
  assignSection,
  getTotalUnits
} from '../controllers/subjectSelectionController.js';
import { requireAuth, requireAdmin } from '../controllers/enrollmentController.js';
import { requireAdminOrRegistrar, authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Student routes (authenticated)
router.get('/:id/available-subjects', requireAuth, getAvailableSubjects);
router.post('/:id/enroll-subjects', requireAuth, enrollSubjects);
router.get('/:id/subjects', requireAuth, getEnrolledSubjects);
router.get('/:id/total-units', requireAuth, getTotalUnits);

// Admin or Registrar routes
router.put('/:id/assign-section', authenticateToken, requireAdminOrRegistrar, assignSection);

export default router;
