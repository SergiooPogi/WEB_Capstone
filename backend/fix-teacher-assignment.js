import { sequelize } from './models/db.js';

// 1. Assign Demver Minon (id=6) as adviser of JHS-7A (id=1) via teacherId
await sequelize.query(
  `UPDATE sections SET teacherId = 6, updatedAt = datetime('now') WHERE id = 1`
);
console.log('✅ teacherId set to 6 on JHS-7A');

// 2. Clear incorrect instructor from Sergio's enrollment subjects
// (instructor should be null until admin assigns per-subject teachers)
await sequelize.query(
  `UPDATE enrollment_subjects SET instructor = NULL, updatedAt = datetime('now')
   WHERE sectionId = 1`
);
console.log('✅ Cleared copied instructor from JHS-7A enrollment subjects');

// Verify
const [s] = await sequelize.query(
  'SELECT id, code, teacherId, instructor FROM sections WHERE id = 1'
);
console.log('Section JHS-7A:', JSON.stringify(s[0]));

const [es] = await sequelize.query(
  `SELECT subjectCode, instructor FROM enrollment_subjects WHERE sectionId = 1 LIMIT 3`
);
console.log('Sample enrollment subjects:', JSON.stringify(es));

process.exit(0);
