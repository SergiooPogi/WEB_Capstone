import { sequelize } from './models/db.js';
const [buildings] = await sequelize.query(
  'SELECT id, name, shortName, imageUrl, isActive FROM Buildings'
);
console.log('Buildings:', JSON.stringify(buildings, null, 2));
process.exit(0);
