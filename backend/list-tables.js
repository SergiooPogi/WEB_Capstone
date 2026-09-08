import sqlite3 from 'sqlite3';

const db = new sqlite3.Database('./database.sqlite');

db.all(`
  SELECT name FROM sqlite_master 
  WHERE type='table'
  ORDER BY name
`, (err, tables) => {
  if (err) {
    console.error('Error:', err.message);
  } else {
    console.log('Tables in database:');
    tables.forEach(t => console.log(`  - ${t.name}`));
  }
  db.close();
});
