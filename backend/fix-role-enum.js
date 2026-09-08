import { sequelize } from './models/db.js';

await sequelize.authenticate();

try {
  await sequelize.query(`ALTER TABLE users MODIFY COLUMN role ENUM('student', 'registrar', 'admin') NOT NULL DEFAULT 'student'`);
  console.log('✅ Updated role enum successfully');
} catch (e) {
  console.error('❌ Error:', e.message);
}

await sequelize.close();
