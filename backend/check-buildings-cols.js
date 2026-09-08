import { sequelize } from './models/db.js';
const [cols] = await sequelize.query("PRAGMA table_info(buildings)");
console.log(cols.map(c => c.name).join('\n'));
const [rows] = await sequelize.query("SELECT * FROM buildings LIMIT 3");
console.log('\nData:', JSON.stringify(rows, null, 2));
await sequelize.close();
