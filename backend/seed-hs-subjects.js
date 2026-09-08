/**
 * Seed JHS and SHS subjects
 * Run: node seed-hs-subjects.js
 */
import { sequelize } from './models/db.js';

const JHS_SUBJECTS = [
  // Grade 7 - 1st Semester
  { code: 'ENG7-1', description: 'English 7', units: 1.5, programCode: 'JHS', gradeLevel: 7, semester: '1st' },
  { code: 'FIL7-1', description: 'Filipino 7', units: 1.5, programCode: 'JHS', gradeLevel: 7, semester: '1st' },
  { code: 'MATH7-1', description: 'Mathematics 7', units: 1.5, programCode: 'JHS', gradeLevel: 7, semester: '1st' },
  { code: 'SCI7-1', description: 'Science 7', units: 1.5, programCode: 'JHS', gradeLevel: 7, semester: '1st' },
  { code: 'AP7-1', description: 'Araling Panlipunan 7', units: 1.5, programCode: 'JHS', gradeLevel: 7, semester: '1st' },
  { code: 'TLE7-1', description: 'Technology and Livelihood Education 7', units: 1.5, programCode: 'JHS', gradeLevel: 7, semester: '1st' },
  { code: 'MAPEH7-1', description: 'MAPEH 7', units: 1.5, programCode: 'JHS', gradeLevel: 7, semester: '1st' },
  { code: 'ESP7-1', description: 'Edukasyon sa Pagpapakatao 7', units: 1.5, programCode: 'JHS', gradeLevel: 7, semester: '1st' },
  // Grade 7 - 2nd Semester
  { code: 'ENG7-2', description: 'English 7 (2nd Sem)', units: 1.5, programCode: 'JHS', gradeLevel: 7, semester: '2nd' },
  { code: 'FIL7-2', description: 'Filipino 7 (2nd Sem)', units: 1.5, programCode: 'JHS', gradeLevel: 7, semester: '2nd' },
  { code: 'MATH7-2', description: 'Mathematics 7 (2nd Sem)', units: 1.5, programCode: 'JHS', gradeLevel: 7, semester: '2nd' },
  { code: 'SCI7-2', description: 'Science 7 (2nd Sem)', units: 1.5, programCode: 'JHS', gradeLevel: 7, semester: '2nd' },
  { code: 'AP7-2', description: 'Araling Panlipunan 7 (2nd Sem)', units: 1.5, programCode: 'JHS', gradeLevel: 7, semester: '2nd' },
  { code: 'TLE7-2', description: 'TLE 7 (2nd Sem)', units: 1.5, programCode: 'JHS', gradeLevel: 7, semester: '2nd' },
  { code: 'MAPEH7-2', description: 'MAPEH 7 (2nd Sem)', units: 1.5, programCode: 'JHS', gradeLevel: 7, semester: '2nd' },
  { code: 'ESP7-2', description: 'EsP 7 (2nd Sem)', units: 1.5, programCode: 'JHS', gradeLevel: 7, semester: '2nd' },
  // Grade 8
  { code: 'ENG8-1', description: 'English 8', units: 1.5, programCode: 'JHS', gradeLevel: 8, semester: '1st' },
  { code: 'FIL8-1', description: 'Filipino 8', units: 1.5, programCode: 'JHS', gradeLevel: 8, semester: '1st' },
  { code: 'MATH8-1', description: 'Mathematics 8', units: 1.5, programCode: 'JHS', gradeLevel: 8, semester: '1st' },
  { code: 'SCI8-1', description: 'Science 8', units: 1.5, programCode: 'JHS', gradeLevel: 8, semester: '1st' },
  { code: 'AP8-1', description: 'Araling Panlipunan 8', units: 1.5, programCode: 'JHS', gradeLevel: 8, semester: '1st' },
  { code: 'TLE8-1', description: 'TLE 8', units: 1.5, programCode: 'JHS', gradeLevel: 8, semester: '1st' },
  { code: 'MAPEH8-1', description: 'MAPEH 8', units: 1.5, programCode: 'JHS', gradeLevel: 8, semester: '1st' },
  { code: 'ESP8-1', description: 'EsP 8', units: 1.5, programCode: 'JHS', gradeLevel: 8, semester: '1st' },
  // Grade 9
  { code: 'ENG9-1', description: 'English 9', units: 1.5, programCode: 'JHS', gradeLevel: 9, semester: '1st' },
  { code: 'FIL9-1', description: 'Filipino 9', units: 1.5, programCode: 'JHS', gradeLevel: 9, semester: '1st' },
  { code: 'MATH9-1', description: 'Mathematics 9', units: 1.5, programCode: 'JHS', gradeLevel: 9, semester: '1st' },
  { code: 'SCI9-1', description: 'Science 9', units: 1.5, programCode: 'JHS', gradeLevel: 9, semester: '1st' },
  { code: 'AP9-1', description: 'Araling Panlipunan 9', units: 1.5, programCode: 'JHS', gradeLevel: 9, semester: '1st' },
  { code: 'TLE9-1', description: 'TLE 9', units: 1.5, programCode: 'JHS', gradeLevel: 9, semester: '1st' },
  { code: 'MAPEH9-1', description: 'MAPEH 9', units: 1.5, programCode: 'JHS', gradeLevel: 9, semester: '1st' },
  { code: 'ESP9-1', description: 'EsP 9', units: 1.5, programCode: 'JHS', gradeLevel: 9, semester: '1st' },
  // Grade 10
  { code: 'ENG10-1', description: 'English 10', units: 1.5, programCode: 'JHS', gradeLevel: 10, semester: '1st' },
  { code: 'FIL10-1', description: 'Filipino 10', units: 1.5, programCode: 'JHS', gradeLevel: 10, semester: '1st' },
  { code: 'MATH10-1', description: 'Mathematics 10', units: 1.5, programCode: 'JHS', gradeLevel: 10, semester: '1st' },
  { code: 'SCI10-1', description: 'Science 10', units: 1.5, programCode: 'JHS', gradeLevel: 10, semester: '1st' },
  { code: 'AP10-1', description: 'Araling Panlipunan 10', units: 1.5, programCode: 'JHS', gradeLevel: 10, semester: '1st' },
  { code: 'TLE10-1', description: 'TLE 10', units: 1.5, programCode: 'JHS', gradeLevel: 10, semester: '1st' },
  { code: 'MAPEH10-1', description: 'MAPEH 10', units: 1.5, programCode: 'JHS', gradeLevel: 10, semester: '1st' },
  { code: 'ESP10-1', description: 'EsP 10', units: 1.5, programCode: 'JHS', gradeLevel: 10, semester: '1st' },
];

const SHS_SUBJECTS = [
  // Core subjects (all strands, Grade 11 & 12)
  // Grade 11 - 1st Semester core
  { code: 'OC11-1', description: 'Oral Communication', units: 3, programCode: 'SHS', strand: null, gradeLevel: 11, semester: '1st' },
  { code: 'RWS11-1', description: 'Reading and Writing', units: 3, programCode: 'SHS', strand: null, gradeLevel: 11, semester: '1st' },
  { code: 'PCSR11-1', description: 'Philippine Constitution and Social Reform', units: 3, programCode: 'SHS', strand: null, gradeLevel: 11, semester: '1st' },
  { code: 'GEN-MATH11-1', description: 'General Mathematics', units: 3, programCode: 'SHS', strand: null, gradeLevel: 11, semester: '1st' },
  { code: 'EARTH11-1', description: 'Earth and Life Science', units: 3, programCode: 'SHS', strand: null, gradeLevel: 11, semester: '1st' },
  { code: 'PE11-1', description: 'Physical Education and Health 1', units: 3, programCode: 'SHS', strand: null, gradeLevel: 11, semester: '1st' },
  // STEM strand - Grade 11
  { code: 'STEM-PRE-CALC11', description: 'Pre-Calculus', units: 3, programCode: 'SHS', strand: 'STEM', gradeLevel: 11, semester: '1st' },
  { code: 'STEM-BIO11', description: 'Biology', units: 3, programCode: 'SHS', strand: 'STEM', gradeLevel: 11, semester: '1st' },
  // ABM strand - Grade 11
  { code: 'ABM-BM11', description: 'Business Mathematics', units: 3, programCode: 'SHS', strand: 'ABM', gradeLevel: 11, semester: '1st' },
  { code: 'ABM-ORG11', description: 'Organization and Management', units: 3, programCode: 'SHS', strand: 'ABM', gradeLevel: 11, semester: '1st' },
  // HUMSS strand - Grade 11
  { code: 'HUMSS-CW11', description: 'Creative Writing', units: 3, programCode: 'SHS', strand: 'HUMSS', gradeLevel: 11, semester: '1st' },
  { code: 'HUMSS-PHILO11', description: 'Introduction to Philosophy', units: 3, programCode: 'SHS', strand: 'HUMSS', gradeLevel: 11, semester: '1st' },
  // TVL strand - Grade 11
  { code: 'TVL-CSS11', description: 'Computer Systems Servicing', units: 3, programCode: 'SHS', strand: 'TVL', gradeLevel: 11, semester: '1st' },
  { code: 'TVL-ENTREP11', description: 'Entrepreneurship', units: 3, programCode: 'SHS', strand: 'TVL', gradeLevel: 11, semester: '1st' },
  // Sports strand - Grade 11
  { code: 'SPORTS-PE11', description: 'Physical Fitness and Sports', units: 3, programCode: 'SHS', strand: 'Sports', gradeLevel: 11, semester: '1st' },
  { code: 'SPORTS-THEORY11', description: 'Sports Theory and Practice', units: 3, programCode: 'SHS', strand: 'Sports', gradeLevel: 11, semester: '1st' },
  // Arts and Design strand - Grade 11
  { code: 'ARTS-FA11', description: 'Fine Arts and Design', units: 3, programCode: 'SHS', strand: 'Arts and Design', gradeLevel: 11, semester: '1st' },
  { code: 'ARTS-MEDIA11', description: 'Media and Information Literacy', units: 3, programCode: 'SHS', strand: 'Arts and Design', gradeLevel: 11, semester: '1st' },
  // Grade 12 core
  { code: 'ENTREP12-1', description: 'Entrepreneurship', units: 3, programCode: 'SHS', strand: null, gradeLevel: 12, semester: '1st' },
  { code: 'RESEARCH12-1', description: 'Practical Research 2', units: 3, programCode: 'SHS', strand: null, gradeLevel: 12, semester: '1st' },
  { code: 'PE12-1', description: 'Physical Education and Health 3', units: 3, programCode: 'SHS', strand: null, gradeLevel: 12, semester: '1st' },
  // STEM Grade 12
  { code: 'STEM-CALC12', description: 'Basic Calculus', units: 3, programCode: 'SHS', strand: 'STEM', gradeLevel: 12, semester: '1st' },
  { code: 'STEM-CHEM12', description: 'Chemistry', units: 3, programCode: 'SHS', strand: 'STEM', gradeLevel: 12, semester: '1st' },
  // ABM Grade 12
  { code: 'ABM-ACCT12', description: 'Fundamentals of Accountancy', units: 3, programCode: 'SHS', strand: 'ABM', gradeLevel: 12, semester: '1st' },
  { code: 'ABM-MKTG12', description: 'Principles of Marketing', units: 3, programCode: 'SHS', strand: 'ABM', gradeLevel: 12, semester: '1st' },
  // HUMSS Grade 12
  { code: 'HUMSS-SOC12', description: 'Community Engagement', units: 3, programCode: 'SHS', strand: 'HUMSS', gradeLevel: 12, semester: '1st' },
  { code: 'HUMSS-LIT12', description: 'World Literature', units: 3, programCode: 'SHS', strand: 'HUMSS', gradeLevel: 12, semester: '1st' },
  // TVL Grade 12
  { code: 'TVL-CAPSTONE12', description: 'Work Immersion / Capstone', units: 3, programCode: 'SHS', strand: 'TVL', gradeLevel: 12, semester: '1st' },
  // Sports Grade 12
  { code: 'SPORTS-IMMERSION12', description: 'Sports Immersion', units: 3, programCode: 'SHS', strand: 'Sports', gradeLevel: 12, semester: '1st' },
  // Arts Grade 12
  { code: 'ARTS-EXHIBIT12', description: 'Arts Exhibition and Portfolio', units: 3, programCode: 'SHS', strand: 'Arts and Design', gradeLevel: 12, semester: '1st' },
];

async function seed() {
  console.log('🌱 Seeding JHS and SHS subjects...\n');

  let added = 0;
  let skipped = 0;

  const allSubjects = [...JHS_SUBJECTS, ...SHS_SUBJECTS];

  for (const s of allSubjects) {
    try {
      await sequelize.query(
        `INSERT OR IGNORE INTO subjects (code, description, units, programCode, strand, gradeLevel, semester, isActive, createdAt, updatedAt)
         VALUES (?, ?, ?, ?, ?, ?, ?, 1, datetime('now'), datetime('now'))`,
        { replacements: [s.code, s.description, s.units, s.programCode, s.strand || null, s.gradeLevel, s.semester] }
      );
      console.log(`  ✅ ${s.code} — ${s.description}`);
      added++;
    } catch (err) {
      console.log(`  ⚠️  Skipped ${s.code}: ${err.message}`);
      skipped++;
    }
  }

  console.log(`\n✅ Done! Added ${added} subjects, skipped ${skipped}`);
  process.exit(0);
}

seed().catch(err => {
  console.error('❌ Seed failed:', err.message);
  process.exit(1);
});
