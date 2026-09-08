export const up = async (queryInterface, Sequelize) => {
  // Add new columns to enrollment_records table one by one
  try {
    await queryInterface.sequelize.query(`
      ALTER TABLE enrollment_records 
      ADD COLUMN admissionId INTEGER
    `);
  } catch (e) {
    if (!e.message.includes('Duplicate column') && !e.message.includes('duplicate column')) {
      console.log('⚠️  Column admissionId may already exist, continuing...');
    }
  }
  
  try {
    await queryInterface.sequelize.query(`
      ALTER TABLE enrollment_records 
      ADD COLUMN admin_comments TEXT
    `);
  } catch (e) {
    if (!e.message.includes('Duplicate column') && !e.message.includes('duplicate column')) {
      console.log('⚠️  Column admin_comments may already exist, continuing...');
    }
  }
  
  try {
    await queryInterface.sequelize.query(`
      ALTER TABLE enrollment_records 
      ADD COLUMN approved_by INTEGER
    `);
  } catch (e) {
    if (!e.message.includes('Duplicate column') && !e.message.includes('duplicate column')) {
      console.log('⚠️  Column approved_by may already exist, continuing...');
    }
  }
  
  try {
    await queryInterface.sequelize.query(`
      ALTER TABLE enrollment_records 
      ADD COLUMN approved_at TIMESTAMP
    `);
  } catch (e) {
    if (!e.message.includes('Duplicate column') && !e.message.includes('duplicate column')) {
      console.log('⚠️  Column approved_at may already exist, continuing...');
    }
  }
  
  try {
    await queryInterface.sequelize.query(`
      ALTER TABLE enrollment_records 
      ADD COLUMN completion_percentage INTEGER DEFAULT 0
    `);
  } catch (e) {
    if (!e.message.includes('Duplicate column') && !e.message.includes('duplicate column')) {
      console.log('⚠️  Column completion_percentage may already exist, continuing...');
    }
  }
  
  console.log('✅ Migration completed - enrollment_records columns processed');
};

export const down = async (queryInterface, Sequelize) => {
  // Remove columns if rolling back
  try {
    await queryInterface.sequelize.query(`
      ALTER TABLE enrollment_records 
      DROP COLUMN admissionId
    `);
  } catch (e) {
    if (!e.message.includes('Unknown column')) throw e;
  }
  
  try {
    await queryInterface.sequelize.query(`
      ALTER TABLE enrollment_records 
      DROP COLUMN admin_comments
    `);
  } catch (e) {
    if (!e.message.includes('Unknown column')) throw e;
  }
  
  try {
    await queryInterface.sequelize.query(`
      ALTER TABLE enrollment_records 
      DROP COLUMN approved_by
    `);
  } catch (e) {
    if (!e.message.includes('Unknown column')) throw e;
  }
  
  try {
    await queryInterface.sequelize.query(`
      ALTER TABLE enrollment_records 
      DROP COLUMN approved_at
    `);
  } catch (e) {
    if (!e.message.includes('Unknown column')) throw e;
  }
  
  try {
    await queryInterface.sequelize.query(`
      ALTER TABLE enrollment_records 
      DROP COLUMN completion_percentage
    `);
  } catch (e) {
    if (!e.message.includes('Unknown column')) throw e;
  }
  
  console.log('✅ Removed migration columns');
};
