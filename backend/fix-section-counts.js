/**
 * Recalculate and fix all section currentEnrollment counts
 * based on actual enrolled students in enrollment_records.
 * Safe to run at any time.
 */
import { sequelize } from './models/db.js';

console.log('🔧 Fixing section enrollment counts...\n');

// Get actual count per section from enrollment_records
const [actualCounts] = await sequelize.query(`
  SELECT sectionId, COUNT(*) as actualCount
  FROM enrollment_records
  WHERE sectionId IS NOT NULL
    AND status IN ('enrolled', 'active', 'completed')
  GROUP BY sectionId
`);

// Get all sections
const [sections] = await sequelize.query('SELECT id, code, currentEnrollment FROM sections');

let fixed = 0;
for (const section of sections) {
  const actual = actualCounts.find(r => r.sectionId === section.id);
  const correctCount = actual ? Number(actual.actualCount) : 0;
  if (section.currentEnrollment !== correctCount) {
    await sequelize.query(
      'UPDATE sections SET currentEnrollment = ?, updatedAt = datetime(\'now\') WHERE id = ?',
      { replacements: [correctCount, section.id] }
    );
    console.log(`  ${section.code}: ${section.currentEnrollment} → ${correctCount}`);
    fixed++;
  }
}

if (fixed === 0) {
  console.log('  ✅ All section counts are already correct');
} else {
  console.log(`\n✅ Fixed ${fixed} section(s)`);
}

process.exit(0);
