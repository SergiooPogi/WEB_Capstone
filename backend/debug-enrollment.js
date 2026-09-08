import sqlite3 from 'sqlite3';

const db = new sqlite3.Database('./database.sqlite');

// Get the latest enrollment
db.get(`
  SELECT id, userId, educationLevel, course, major, curriculumYear, studentStatus
  FROM enrollment_records
  ORDER BY id DESC
  LIMIT 1
`, (err, enrollment) => {
  if (err) {
    console.error('Error:', err.message);
    db.close();
    return;
  }
  
  console.log('Latest Enrollment:');
  console.table([enrollment]);
  
  // Now check what subjects match this enrollment
  const gradeLevel = enrollment.curriculumYear ? parseInt(enrollment.curriculumYear) : 1;
  
  console.log(`\nSearching for subjects with:`);
  console.log(`  programCode: ${enrollment.course}`);
  console.log(`  gradeLevel: ${gradeLevel}`);
  console.log(`  semester: 1st`);
  
  db.all(`
    SELECT id, code, description, programCode, gradeLevel, semester
    FROM subjects
    WHERE programCode = ? AND gradeLevel = ? AND semester = ?
  `, [enrollment.course, gradeLevel, '1st'], (err, subjects) => {
    if (err) {
      console.error('Error:', err.message);
    } else {
      console.log(`\nFound ${subjects.length} subjects:`);
      console.table(subjects);
    }
    db.close();
  });
});
