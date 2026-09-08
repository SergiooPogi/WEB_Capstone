import { sequelize } from './models/db.js';

const teacherId = 6; // Demver Minon

const [sections] = await sequelize.query(
  `SELECT s.id, s.code, s.course, s.yearLevel, s.strand, s.semester,
          s.schoolYear, s.instructor, s.schedule, s.room,
          s.capacity, s.currentEnrollment,
          COUNT(er.id) as studentCount
   FROM sections s
   LEFT JOIN enrollment_records er
     ON er.sectionId = s.id AND er.status IN ('enrolled','active','completed')
   WHERE s.teacherId = ? AND s.isActive = 1
   GROUP BY s.id`,
  { replacements: [teacherId] }
);
console.log('Teacher sections:', JSON.stringify(sections, null, 2));

const [students] = await sequelize.query(
  `SELECT er.id, er.firstName, er.familyName, er.studentNumber,
          er.gradeLevel, er.sscClass, er.status
   FROM enrollment_records er
   WHERE er.sectionId = 1 AND er.status IN ('enrolled','active','completed')`,
);
console.log('Students in JHS-7A:', JSON.stringify(students, null, 2));

process.exit(0);
