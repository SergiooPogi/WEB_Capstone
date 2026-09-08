import sqlite3 from 'sqlite3';

const db = new sqlite3.Database('./database.sqlite');

db.all(`
  SELECT DISTINCT programCode FROM subjects ORDER BY programCode
`, (err, programs) => {
  if (err) {
    console.error('Error:', err.message);
    db.close();
    return;
  }
  
  console.log('Programs with subjects:');
  programs.forEach(p => console.log(`  - ${p.programCode}`));
  
  // Check each program
  programs.forEach(p => {
    db.all(`
      SELECT programCode, gradeLevel, COUNT(*) as count
      FROM subjects
      WHERE programCode = ?
      GROUP BY gradeLevel
      ORDER BY gradeLevel
    `, [p.programCode], (err, rows) => {
      if (!err) {
        console.log(`\n${p.programCode}:`);
        console.table(rows);
      }
    });
  });
  
  setTimeout(() => db.close(), 1000);
});
