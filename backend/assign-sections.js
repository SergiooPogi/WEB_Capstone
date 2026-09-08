/**
 * Assign sections to all enrolled students that don't have one yet.
 * Run: node assign-sections.js
 */
import { sequelize } from './models/db.js';

// Section map: key → { id, code }
const sectionMap = {
  'JHS-7':        { id: 46, code: 'JHS-7A' },
  'JHS-8':        { id: 47, code: 'JHS-8A' },
  'JHS-9':        { id: 48, code: 'JHS-9A' },
  'JHS-10':       { id: 49, code: 'JHS-10A' },
  'SHS-11-STEM':  { id: 50, code: 'SHS-11-STEM' },
  'SHS-11-ABM':   { id: 51, code: 'SHS-11-ABM' },
  'SHS-11-HUMSS': { id: 52, code: 'SHS-11-HUMSS' },
  'SHS-12-STEM':  { id: 56, code: 'SHS-12-STEM' },
  'SHS-12-ABM':   { id: 57, code: 'SHS-12-ABM' },
  'SHS-12-HUMSS': { id: 58, code: 'SHS-12-HUMSS' },
  'BEED':         { id: 62, code: 'BEED-1A' },
  'BSBA':         { id: 64, code: 'BSBA-1A' },
  'BSCrim':       { id: 66, code: 'BSCrim-1A' },
  'BSED':         { id: 65, code: 'BSED-1A' },
  'BSIS':         { id: 63, code: 'BSIS-1A' },
};

function getSectionKey(enrollment) {
  const level = enrollment.educationLevel;
  if (level === 'JHS') {
    const grade = (enrollment.gradeLevel || '').replace('Grade ', '');
    return `JHS-${grade}`;
  }
  if (level === 'SHS') {
    const grade = (enrollment.gradeLevel || '').replace('Grade ', '');
    const strand = enrollment.strand || 'STEM';
    return `SHS-${grade}-${strand}`;
  }
  if (level === 'College') {
    return enrollment.course || null;
  }
  return null;
}

// Get all enrolled students without a section
const [enrollments] = await sequelize.query(
  `SELECT id, educationLevel, gradeLevel, strand, course, firstName, familyName
   FROM enrollment_records
   WHERE status = 'enrolled' AND (sectionId IS NULL OR sectionId = '')`,
);

console.log(`Found ${enrollments.length} enrolled students without sections.\n`);

let assigned = 0;
let skipped = 0;

for (const e of enrollments) {
  const key = getSectionKey(e);
  const section = key ? sectionMap[key] : null;

  if (!section) {
    console.log(`  ⚠️  No section found for ${e.firstName} ${e.familyName} (${e.educationLevel} ${e.gradeLevel || e.course || ''})`);
    skipped++;
    continue;
  }

  await sequelize.query(
    `UPDATE enrollment_records
     SET sectionId = ?, sectionName = ?, updatedAt = datetime('now')
     WHERE id = ?`,
    { replacements: [section.id, section.code, e.id] }
  );

  // Update section enrollment count
  await sequelize.query(
    `UPDATE sections SET currentEnrollment = currentEnrollment + 1, updatedAt = datetime('now') WHERE id = ?`,
    { replacements: [section.id] }
  );

  console.log(`  ✅ ${e.firstName} ${e.familyName} → Section ${section.code}`);
  assigned++;
}

console.log(`\n✅ Done! Assigned ${assigned} students to sections. ${skipped} skipped (no matching section).`);
process.exit(0);
