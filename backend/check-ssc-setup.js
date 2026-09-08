import { sequelize } from './models/db.js';

const [sections] = await sequelize.query(
  "SELECT id, code, course, yearLevel, strand, currentEnrollment, capacity FROM sections WHERE course='JHS' AND yearLevel=7"
);
console.log('JHS Grade 7 sections:', JSON.stringify(sections, null, 2));

const [subjects] = await sequelize.query(
  "SELECT COUNT(*) as cnt FROM subjects WHERE programCode='JHS' AND gradeLevel=7"
);
console.log('JHS Grade 7 subject count:', subjects[0].cnt);

const [allSubjects] = await sequelize.query(
  "SELECT code, semester FROM subjects WHERE programCode='JHS' AND gradeLevel=7 LIMIT 3"
);
console.log('Sample JHS G7 subjects:', JSON.stringify(allSubjects));

process.exit(0);
