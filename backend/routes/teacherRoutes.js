import express from 'express';
import { authenticateToken, requireTeacher } from '../middleware/auth.js';
import { getTeacherSections, getSectionStudents } from '../controllers/teacherController.js';

const router = express.Router();

router.use(authenticateToken);
router.use(requireTeacher);

// GET /api/teacher/sections — all sections assigned to this teacher
router.get('/sections', getTeacherSections);

// GET /api/teacher/sections/:id/students — students in a specific section
router.get('/sections/:id/students', getSectionStudents);

export default router;
