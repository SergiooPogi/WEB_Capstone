import sqlite3 from 'sqlite3';

const db = new sqlite3.Database('./database.sqlite');

db.all(`
  SELECT DISTINCT curriculumYear FROM enrollment_records
`, (err, rows) => {
  if (err) {
    console.error('Error:', err.message);
  } else {
    console.log('Unique curriculumYear values:');
    console.table(rows);
  }
  db.close();
});
