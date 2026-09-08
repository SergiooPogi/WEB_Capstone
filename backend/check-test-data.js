import { sequelize } from './models/db.js';

const [users] = await sequelize.query('SELECT id, name, email, role FROM users ORDER BY role, id');
console.log('=== USERS ===');
users.forEach(u => console.log(u.id, (u.role||'').padEnd(12), u.email, u.name || ''));

const [enrollments] = await sequelize.query(`
  SELECT er.id, er.firstName, er.familyName, er.educationLevel, er.gradeLevel,
         er.enrollmentType, er.status, er.lifeStatus, er.academicYear, u.email
  FROM enrollment_records er
  LEFT JOIN users u ON er.userId = u.id
  ORDER BY er.id DESC LIMIT 20
`);
console.log('\n=== ENROLLMENTS (last 20) ===');
if (enrollments.length === 0) {
  console.log('  (none)');
} else {
  enrollments.forEach(e => console.log(
    String(e.id).padStart(4),
    (e.status || '').padEnd(18),
    (e.lifeStatus || '-').padEnd(16),
    (e.educationLevel || '').padEnd(5),
    (e.gradeLevel || '').padEnd(10),
    (e.enrollmentType || '').padEnd(12),
    ((e.firstName || '') + ' ' + (e.familyName || '')).trim().padEnd(20),
    '|', e.email || ''
  ));
}

const [sy] = await sequelize.query('SELECT id, year, isActive FROM school_years');
console.log('\n=== SCHOOL YEARS ===');
if (sy.length === 0) console.log('  (none — you need an active school year)');
else sy.forEach(s => console.log(s.id, s.year, s.isActive ? '[ACTIVE]' : ''));

const [sections] = await sequelize.query(`
  SELECT id, code, course, yearLevel, strand, currentEnrollment, capacity, schoolYear
  FROM sections WHERE isActive = 1 LIMIT 10
`);
console.log('\n=== SECTIONS (first 10 active) ===');
if (sections.length === 0) console.log('  (none)');
else sections.forEach(s => console.log(s.id, s.code, s.course, 'Grade', s.yearLevel, s.strand || '', `${s.currentEnrollment}/${s.capacity}`, s.schoolYear));

await sequelize.close();
