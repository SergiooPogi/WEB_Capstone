import { sequelize } from './models/db.js';
const [cols] = await sequelize.query("PRAGMA table_info(sections)");
console.log(cols.map(c => `${c.name} (${c.type})`).join('\n'));
await sequelize.close();
