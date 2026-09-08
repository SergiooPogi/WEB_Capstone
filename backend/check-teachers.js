import { sequelize } from './models/db.js';
const [teachers] = await sequelize.query("SELECT id, name, email, role FROM users WHERE role = 'teacher'");
console.log('Teachers:', JSON.stringify(teachers));
const [s1] = await sequelize.query("SELECT id, code, teacherId, instructor FROM sections WHERE id = 1");
console.log('Section JHS-7A:', JSON.stringify(s1[0]));
process.exit(0);
