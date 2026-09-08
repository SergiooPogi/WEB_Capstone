export const up = async (queryInterface, Sequelize) => {
  // Add department column to users table
  try {
    await queryInterface.sequelize.query(`
      ALTER TABLE users 
      ADD COLUMN department VARCHAR(100)
    `);
    console.log('✅ Added department column to users table');
  } catch (e) {
    if (!e.message.includes('Duplicate column')) throw e;
    console.log('⏭️  department column already exists');
  }
};

export const down = async (queryInterface, Sequelize) => {
  // Remove department column if rolling back
  try {
    await queryInterface.sequelize.query(`
      ALTER TABLE users 
      DROP COLUMN department
    `);
    console.log('✅ Removed department column from users table');
  } catch (e) {
    if (!e.message.includes('Unknown column')) throw e;
  }
};
