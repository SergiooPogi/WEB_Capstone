import { EnrollmentRecord } from '../models/enrollmentRecordModel.js';
import { EnrollmentSubject } from '../models/enrollmentSubjectModel.js';
import { Subject } from '../models/subjectModel.js';
import { sequelize } from '../models/db.js';

/**
 * Get available subjects for a student based on their enrollment
 * GET /api/enrollments/:id/available-subjects
 */
export const getAvailableSubjects = async (req, res) => {
  try {
    const { id } = req.params;
    
    const enrollment = await EnrollmentRecord.findByPk(id);
    if (!enrollment) {
      return res.status(404).json({ message: 'Enrollment not found' });
    }
    
    // Check authorization
    if (req.user.role !== 'admin' && enrollment.userId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    let subjects = [];
    
    if (enrollment.educationLevel === 'SHS') {
      // SHS: auto-load based on strand and grade level
      const gradeLevel = enrollment.gradeLevel === 'Grade 11' ? 11 : 12;
      subjects = await Subject.findAll({
        where: {
          programCode: 'SHS',
          strand: enrollment.strand,
          gradeLevel: gradeLevel,
          semester: '1st'
        }
      });
    } else if (enrollment.educationLevel === 'JHS') {
      // JHS: load based on grade level
      const gradeLevel = parseInt((enrollment.gradeLevel || '').replace(/\D/g, ''));
      subjects = await Subject.findAll({
        where: {
          programCode: 'JHS',
          gradeLevel: isNaN(gradeLevel) ? 7 : gradeLevel,
          semester: '1st'
        }
      });
    }
    
    res.json({
      enrollment: {
        id: enrollment.id,
        educationLevel: enrollment.educationLevel,
        gradeLevel: enrollment.gradeLevel,
        strand: enrollment.strand,
        course: enrollment.course,
        major: enrollment.major,
        studentStatus: enrollment.studentStatus
      },
      subjects: subjects,
      totalSubjects: subjects.length,
      totalUnits: subjects.reduce((sum, s) => sum + parseFloat(s.units || 0), 0)
    });
  } catch (error) {
    console.error('Get available subjects error:', error);
    res.status(500).json({ message: 'Failed to fetch available subjects' });
  }
};

/**
 * Enroll student in subjects
 * POST /api/enrollments/:id/enroll-subjects
 * Body: { subjectIds: [1, 2, 3] } for irregular students
 *       or {} for regular students (auto-enroll all available)
 */
export const enrollSubjects = async (req, res) => {
  try {
    const { id } = req.params;
    const { subjectIds } = req.body;
    
    const enrollment = await EnrollmentRecord.findByPk(id);
    if (!enrollment) {
      return res.status(404).json({ message: 'Enrollment not found' });
    }
    
    // Check authorization
    if (req.user.role !== 'admin' && enrollment.userId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    // Check if already enrolled in subjects
    const existingCount = await EnrollmentSubject.count({ where: { enrollmentId: id } });
    if (existingCount > 0) {
      return res.status(400).json({ message: 'Student already enrolled in subjects' });
    }
    
    let subjectsToEnroll = [];
    
    if (enrollment.studentStatus === 'irregular' && subjectIds && Array.isArray(subjectIds)) {
      // Irregular: use provided subject IDs
      subjectsToEnroll = await Subject.findAll({
        where: { id: subjectIds }
      });
    } else {
      // Regular: auto-enroll all available subjects
      if (enrollment.educationLevel === 'SHS') {
        const gradeLevel = enrollment.gradeLevel === 'Grade 11' ? 11 : 12;
        subjectsToEnroll = await Subject.findAll({
          where: {
            programCode: 'SHS',
            strand: enrollment.strand,
            gradeLevel: gradeLevel,
            semester: '1st'
          }
        });
      } else if (enrollment.educationLevel === 'JHS') {
        const gradeLevel = parseInt((enrollment.gradeLevel || '').replace(/\D/g, ''));
        subjectsToEnroll = await Subject.findAll({
          where: {
            programCode: 'JHS',
            gradeLevel: isNaN(gradeLevel) ? 7 : gradeLevel,
            semester: '1st'
          }
        });
      }
    }
    
    if (subjectsToEnroll.length === 0) {
      return res.status(400).json({ message: 'No subjects to enroll' });
    }
    
    // Create enrollment subject records
    const enrollmentSubjects = subjectsToEnroll.map(subject => ({
      enrollmentId: id,
      subjectId: subject.id,
      subjectCode: subject.code,
      subjectDescription: subject.description,
      units: subject.units,
      status: 'enrolled'
    }));
    
    await EnrollmentSubject.bulkCreate(enrollmentSubjects);
    
    const totalUnits = subjectsToEnroll.reduce((sum, s) => sum + parseFloat(s.units || 0), 0);
    
    res.json({
      message: `Successfully enrolled in ${subjectsToEnroll.length} subjects`,
      enrollmentId: id,
      subjectsEnrolled: subjectsToEnroll.length,
      totalUnits: totalUnits,
      subjects: subjectsToEnroll.map(s => ({
        id: s.id,
        code: s.code,
        description: s.description,
        units: s.units
      }))
    });
  } catch (error) {
    console.error('Enroll subjects error:', error);
    res.status(500).json({ message: 'Failed to enroll in subjects' });
  }
};

/**
 * Get enrolled subjects for a student
 * GET /api/enrollments/:id/subjects
 */
export const getEnrolledSubjects = async (req, res) => {
  try {
    const { id } = req.params;
    
    const enrollment = await EnrollmentRecord.findByPk(id);
    if (!enrollment) {
      return res.status(404).json({ message: 'Enrollment not found' });
    }
    
    // Check authorization
    if (req.user.role !== 'admin' && enrollment.userId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    const enrolledSubjects = await EnrollmentSubject.findAll({
      where: { enrollmentId: id },
      include: [
        {
          model: Subject,
          as: 'subject',
          attributes: ['id', 'code', 'description', 'units']
        }
      ]
    });
    
    // Format response with section info
    const subjects = enrolledSubjects.map(es => ({
      id: es.id,
      code: es.subjectCode,
      description: es.subjectDescription,
      units: es.units,
      section: es.sectionName || null,
      schedule: es.schedule || null,
      instructor: es.instructor || null,
      room: es.room || null,
      status: es.status
    }));
    
    const totalUnits = enrolledSubjects.reduce((sum, es) => sum + parseFloat(es.units || 0), 0);
    
    res.json({
      enrollmentId: id,
      subjects: subjects,
      totalSubjects: enrolledSubjects.length,
      totalUnits: totalUnits
    });
  } catch (error) {
    console.error('Get enrolled subjects error:', error);
    res.status(500).json({ message: 'Failed to fetch enrolled subjects' });
  }
};

/**
 * Admin: Assign section to enrolled subjects
 * PUT /api/admin/enrollments/:id/assign-section
 * Body: { sectionId, sectionName, schedule, instructor, room }
 */
export const assignSection = async (req, res) => {
  try {
    const { id } = req.params;
    const { sectionId, sectionName, schedule, instructor, room } = req.body;
    
    const enrollment = await EnrollmentRecord.findByPk(id);
    if (!enrollment) {
      return res.status(404).json({ message: 'Enrollment not found' });
    }
    
    // Update all enrolled subjects with section info
    const updated = await EnrollmentSubject.update(
      {
        sectionId: sectionId || null,
        sectionName: sectionName || null,
        schedule: schedule || null,
        instructor: instructor || null,
        room: room || null
      },
      { where: { enrollmentId: id } }
    );
    
    res.json({
      message: `Section assigned to ${updated[0]} subjects`,
      enrollmentId: id,
      subjectsUpdated: updated[0],
      sectionInfo: {
        sectionId,
        sectionName,
        schedule,
        instructor,
        room
      }
    });
  } catch (error) {
    console.error('Assign section error:', error);
    res.status(500).json({ message: 'Failed to assign section' });
  }
};

/**
 * Get total units for an enrollment
 * GET /api/enrollments/:id/total-units
 */
export const getTotalUnits = async (req, res) => {
  try {
    const { id } = req.params;
    
    const enrollment = await EnrollmentRecord.findByPk(id);
    if (!enrollment) {
      return res.status(404).json({ message: 'Enrollment not found' });
    }
    
    const enrolledSubjects = await EnrollmentSubject.findAll({
      where: { enrollmentId: id }
    });
    
    const totalUnits = enrolledSubjects.reduce((sum, es) => sum + parseFloat(es.units || 0), 0);
    
    res.json({
      enrollmentId: id,
      totalSubjects: enrolledSubjects.length,
      totalUnits: totalUnits
    });
  } catch (error) {
    console.error('Get total units error:', error);
    res.status(500).json({ message: 'Failed to calculate total units' });
  }
};
