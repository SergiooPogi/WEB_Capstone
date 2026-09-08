import { sequelize } from './models/db.js';

try {
  await sequelize.query(`
    INSERT INTO enrollment_records (
      userId, educationLevel, gradeLevel, firstName, familyName,
      email, status, sscApplied, sscQualified, grade6Average,
      sscPassingScore, academicYear, semester,
      createdAt, updatedAt
    ) VALUES (
      5, 'JHS', '7', 'Sergio', 'Folloso',
      'sergiofolloso0@gmail.com', 'submitted', 1, 1, 92.5,
      75, '2025-2026', '1st Semester',
      datetime('now'), datetime('now')
    )
  `);

  const [[row]] = await sequelize.query(
    'SELECT id, firstName, familyName, status, sscApplied, sscQualified, grade6Average FROM enrollment_records ORDER BY id DESC LIMIT 1'
  );

  console.log('✅ SSC enrollment created:');
  console.log(`   ID: ${row.id}`);
  console.log(`   Name: ${row.firstName} ${row.familyName}`);
  console.log(`   Status: ${row.status}`);
  console.log(`   SSC Applied: ${row.sscApplied}`);
  console.log(`   SSC Qualified: ${row.sscQualified}`);
  console.log(`   Grade 6 Average: ${row.grade6Average}`);
} catch (err) {
  console.error('Error:', err.message);
} finally {
  await sequelize.close();
}
