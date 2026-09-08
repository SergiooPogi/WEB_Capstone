import { sequelize } from './models/db.js';
import { autoAssignSection } from './services/sectionAssignment.js';

// Show all enrollments
const [enrollments] = await sequelize.query(
  `SELECT id, firstName, familyName, gradeLevel, educationLevel, strand,
          sscApplied, sscClass, sscResult, status, sectionId, sectionName
   FROM enrollment_records ORDER BY id DESC LIMIT 10`
);
console.log('\n📋 Enrollments:');
enrollments.forEach(e => console.log(JSON.stringify(e)));

// Show all sections
const [sections] = await sequelize.query(
  `SELECT id, code, course, yearLevel, strand, currentEnrollment, capacity, isActive
   FROM sections ORDER BY id`
);
console.log('\n📚 Sections:');
sections.forEach(s => console.log(JSON.stringify(s)));

// If there's an enrollment not assigned, try to assign it now
const unassigned = enrollments.filter(e => !e.sectionId && e.status !== 'rejected');
if (unassigned.length > 0) {
  console.log('\n🔄 Trying to auto-assign unassigned enrollments...');
  for (const e of unassigned) {
    console.log(`\nTrying enrollment ID ${e.id} (${e.firstName}, status: ${e.status}, sscClass: ${e.sscClass})...`);
    const result = await autoAssignSection(e.id);
    console.log('Result:', JSON.stringify(result));
  }
}

process.exit(0);
