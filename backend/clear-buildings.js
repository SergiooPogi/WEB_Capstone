import { sequelize } from './models/db.js';
await sequelize.query('DELETE FROM buildings');
console.log('✅ All buildings cleared');
await sequelize.close();
