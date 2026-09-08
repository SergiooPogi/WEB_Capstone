import { sequelize } from './models/db.js';

async function columnExists(tableName, columnName) {
  try {
    const [results] = await sequelize.query(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = DATABASE() 
        AND TABLE_NAME = '${tableName}' 
        AND COLUMN_NAME = '${columnName}'
    `);
    return results.length > 0;
  } catch (error) {
    return false;
  }
}

async function runMigration() {
  try {
    console.log('🚀 Running enrollment status migration...\n');
    
    // Check and add columns one by one
    const columns = [
      { name: 'status', sql: "ADD COLUMN status VARCHAR(20) DEFAULT 'draft'" },
      { name: 'admin_comments', sql: 'ADD COLUMN admin_comments TEXT' },
      { name: 'approved_by', sql: 'ADD COLUMN approved_by INTEGER' },
      { name: 'approved_at', sql: 'ADD COLUMN approved_at TIMESTAMP NULL' },
      { name: 'completion_percentage', sql: 'ADD COLUMN completion_percentage INTEGER DEFAULT 0' }
    ];
    
    for (const column of columns) {
      const exists = await columnExists('enrollment_records', column.name);
      if (!exists) {
        await sequelize.query(`ALTER TABLE enrollment_records ${column.sql}`);
        console.log(`✅ Added column: ${column.name}`);
      } else {
        console.log(`⏭️  Column already exists: ${column.name}`);
      }
    }
    
    console.log('\n✅ All columns added successfully!');
    
    // Update existing records to have 'submitted' status if they have data
    const [updateResult] = await sequelize.query(`
      UPDATE enrollment_records 
      SET status = 'submitted'
      WHERE (status IS NULL OR status = 'draft')
        AND studentType IS NOT NULL 
        AND course IS NOT NULL
        AND firstName IS NOT NULL;
    `);
    
    console.log(`\n✅ Updated ${updateResult.affectedRows || 0} existing enrollments to 'submitted' status`);
    
    // Show current status distribution
    const [stats] = await sequelize.query(`
      SELECT 
        COALESCE(status, 'NULL') as status,
        COUNT(*) as count
      FROM enrollment_records
      GROUP BY status
      ORDER BY count DESC;
    `);
    
    console.log('\n📊 Current enrollment status distribution:');
    stats.forEach(row => {
      console.log(`   ${row.status}: ${row.count}`);
    });
    
    console.log('\n✅ Migration completed successfully!');
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    console.error(error);
    process.exit(1);
  }
}

runMigration();
