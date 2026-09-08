import { sequelize } from './models/db.js';

const [tables] = await sequelize.query("SELECT name FROM sqlite_master WHERE type='table'");
console.log('Tables:', tables.map(t => t.name));

// Check if enrollment_documents exists
const hasDocTable = tables.some(t => t.name === 'enrollment_documents');
console.log('enrollment_documents exists:', hasDocTable);

if (!hasDocTable) {
  console.log('Creating enrollment_documents table...');
  await sequelize.query(`
    CREATE TABLE IF NOT EXISTS enrollment_documents (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      enrollmentId INTEGER NOT NULL,
      documentType VARCHAR(50) NOT NULL,
      documentLabel VARCHAR(100),
      filePath VARCHAR(500) NOT NULL,
      originalName VARCHAR(255) NOT NULL,
      mimeType VARCHAR(100),
      fileSize INTEGER,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
  console.log('Table created!');
}

process.exit(0);
