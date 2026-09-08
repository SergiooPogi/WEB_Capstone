import { sequelize } from './models/db.js';
const [cols] = await sequelize.query("PRAGMA table_info(enrollment_records)");
console.log(cols.map(c => c.name).join('\n'));
await sequelize.close();
