/*
MIT License

Copyright (c) 2025 Christian I. Cabrera || XianFire Framework
Mindoro State University - Philippines
*/

import { sequelize } from './models/index.js';

async function syncDatabase() {
  try {
    console.log('🔄 Syncing database...');
    
    // Force sync - drops and recreates all tables
    await sequelize.sync({ force: true });
    
    console.log('✅ Database synced successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Database sync failed:', error.message);
    console.error(error);
    process.exit(1);
  }
}

syncDatabase();
