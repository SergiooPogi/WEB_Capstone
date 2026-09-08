import { sequelize } from './models/db.js';
import './models/userModel.js';
import './models/enrollmentRecordModel.js';

(async () => {
  try {
    console.log('🔄 Syncing SSC fields to database...');
    
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
    await sequelize.sync({ alter: true });
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
    
    console.log('✅ SSC fields added successfully!');
    console.log('   - sscApplied (boolean)');
    console.log('   - sscQualified (boolean)');
    console.log('   - sscExamDate (date)');
    console.log('   - sscExamScore (decimal)');
    console.log('   - sscPassingScore (decimal, default 75)');
    console.log('   - sscResult (enum: passed/failed)');
    console.log('   - sscClass (enum: SSC/Regular)');
    console.log('   - status updated (added pending_exam)');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error syncing database:', error);
    process.exit(1);
  }
})();
