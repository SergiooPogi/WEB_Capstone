import sqlite3 from 'sqlite3';

const db = new sqlite3.Database('./database.sqlite');

db.all(`
  SELECT id, code, description, programCode, strand, gradeLevel, semester 
  FROM subjects 
  LIMIT 20
`, (err, rows) => {
  if (err) {
    console.error('Error:', err.message);
  } else {
    console.log('Subjects in database:');
    console.table(rows);
  }
  
  // Also check BSED subjects specifically
  db.all(`
    SELECT id, code, description, programCode, strand, gradeLevel, semester 
    FROM subjects 
    WHERE programCode = 'BSED'
  `, (err, rows) => {
    if (err) {
      console.error('Error:', err.message);
    } else {
      console.log('\nBSED Subjects:');
      console.table(rows);
    }
    db.close();
  });
});
