import { sequelize } from './models/db.js';
import './models/userModel.js';
import './models/enrollmentRecordModel.js';
import './models/subjectModel.js';
import './models/enrollmentSubjectModel.js';

(async () => {
  try {
    console.log('🔄 Syncing enrollment_subjects table...');
    
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
    await sequelize.sync({ alter: true });
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
    
    console.log('✅ enrollment_subjects table synced successfully!');
    console.log('   - enrollmentId (FK to enrollments)');
    console.log('   - subjectId (FK to subjects)');
    console.log('   - subjectCode, subjectDescription, units');
    console.log('   - sectionId, sectionName, schedule, instructor, room');
    console.log('   - grade, status');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error syncing database:', error);
    process.exit(1);
  }
})();
