import { sequelize } from './models/db.js';
import { Subject } from './models/subjectModel.js';
import './models/enrollmentSubjectModel.js';

const subjects = [
  // ============ SHS STEM (Grade 11-12) ============
  { code: 'STEM-MATH-11', description: 'General Mathematics', units: 4, programCode: 'SHS', major: 'STEM', yearLevel: 11, semester: '1st' },
  { code: 'STEM-PHYS-11', description: 'Physics', units: 4, programCode: 'SHS', major: 'STEM', yearLevel: 11, semester: '1st' },
  { code: 'STEM-CHEM-11', description: 'Chemistry', units: 4, programCode: 'SHS', major: 'STEM', yearLevel: 11, semester: '1st' },
  { code: 'STEM-BIO-11', description: 'Biology', units: 4, programCode: 'SHS', major: 'STEM', yearLevel: 11, semester: '1st' },
  { code: 'STEM-ENG-11', description: 'English', units: 3, programCode: 'SHS', major: 'STEM', yearLevel: 11, semester: '1st' },
  { code: 'STEM-FIL-11', description: 'Filipino', units: 3, programCode: 'SHS', major: 'STEM', yearLevel: 11, semester: '1st' },
  { code: 'STEM-HIST-11', description: 'History', units: 3, programCode: 'SHS', major: 'STEM', yearLevel: 11, semester: '1st' },
  { code: 'STEM-PE-11', description: 'Physical Education', units: 2, programCode: 'SHS', major: 'STEM', yearLevel: 11, semester: '1st' },
  
  { code: 'STEM-MATH-12', description: 'Calculus', units: 4, programCode: 'SHS', major: 'STEM', yearLevel: 12, semester: '1st' },
  { code: 'STEM-PHYS-12', description: 'Advanced Physics', units: 4, programCode: 'SHS', major: 'STEM', yearLevel: 12, semester: '1st' },
  { code: 'STEM-CHEM-12', description: 'Organic Chemistry', units: 4, programCode: 'SHS', major: 'STEM', yearLevel: 12, semester: '1st' },
  { code: 'STEM-BIO-12', description: 'Advanced Biology', units: 4, programCode: 'SHS', major: 'STEM', yearLevel: 12, semester: '1st' },
  
  // ============ SHS ABM (Grade 11-12) ============
  { code: 'ABM-ACCT-11', description: 'Accounting', units: 4, programCode: 'SHS', major: 'ABM', yearLevel: 11, semester: '1st' },
  { code: 'ABM-BUS-11', description: 'Business Management', units: 4, programCode: 'SHS', major: 'ABM', yearLevel: 11, semester: '1st' },
  { code: 'ABM-ECON-11', description: 'Economics', units: 3, programCode: 'SHS', major: 'ABM', yearLevel: 11, semester: '1st' },
  { code: 'ABM-ENG-11', description: 'English', units: 3, programCode: 'SHS', major: 'ABM', yearLevel: 11, semester: '1st' },
  { code: 'ABM-FIL-11', description: 'Filipino', units: 3, programCode: 'SHS', major: 'ABM', yearLevel: 11, semester: '1st' },
  { code: 'ABM-HIST-11', description: 'History', units: 3, programCode: 'SHS', major: 'ABM', yearLevel: 11, semester: '1st' },
  
  { code: 'ABM-ACCT-12', description: 'Advanced Accounting', units: 4, programCode: 'SHS', major: 'ABM', yearLevel: 12, semester: '1st' },
  { code: 'ABM-BUS-12', description: 'Advanced Business Management', units: 4, programCode: 'SHS', major: 'ABM', yearLevel: 12, semester: '1st' },
  { code: 'ABM-ECON-12', description: 'Advanced Economics', units: 3, programCode: 'SHS', major: 'ABM', yearLevel: 12, semester: '1st' },
  
  // ============ SHS HUMSS (Grade 11-12) ============
  { code: 'HUMSS-HIST-11', description: 'World History', units: 4, programCode: 'SHS', major: 'HUMSS', yearLevel: 11, semester: '1st' },
  { code: 'HUMSS-LIT-11', description: 'Literature', units: 4, programCode: 'SHS', major: 'HUMSS', yearLevel: 11, semester: '1st' },
  { code: 'HUMSS-PSYCH-11', description: 'Psychology', units: 3, programCode: 'SHS', major: 'HUMSS', yearLevel: 11, semester: '1st' },
  { code: 'HUMSS-ENG-11', description: 'English', units: 3, programCode: 'SHS', major: 'HUMSS', yearLevel: 11, semester: '1st' },
  { code: 'HUMSS-FIL-11', description: 'Filipino', units: 3, programCode: 'SHS', major: 'HUMSS', yearLevel: 11, semester: '1st' },
  
  { code: 'HUMSS-HIST-12', description: 'Philippine History', units: 4, programCode: 'SHS', major: 'HUMSS', yearLevel: 12, semester: '1st' },
  { code: 'HUMSS-LIT-12', description: 'Advanced Literature', units: 4, programCode: 'SHS', major: 'HUMSS', yearLevel: 12, semester: '1st' },
  { code: 'HUMSS-PSYCH-12', description: 'Advanced Psychology', units: 3, programCode: 'SHS', major: 'HUMSS', yearLevel: 12, semester: '1st' },
  
  // ============ COLLEGE BSIS (Year 1-4) ============
  { code: 'BSIS-PROG-1', description: 'Programming Fundamentals', units: 3, programCode: 'BSIS', major: null, yearLevel: 1, semester: '1st' },
  { code: 'BSIS-DB-1', description: 'Database Fundamentals', units: 3, programCode: 'BSIS', major: null, yearLevel: 1, semester: '1st' },
  { code: 'BSIS-WEB-1', description: 'Web Development Basics', units: 3, programCode: 'BSIS', major: null, yearLevel: 1, semester: '1st' },
  { code: 'BSIS-MATH-1', description: 'Discrete Mathematics', units: 3, programCode: 'BSIS', major: null, yearLevel: 1, semester: '1st' },
  { code: 'BSIS-ENG-1', description: 'English Communication', units: 3, programCode: 'BSIS', major: null, yearLevel: 1, semester: '1st' },
  
  { code: 'BSIS-PROG-2', description: 'Object-Oriented Programming', units: 3, programCode: 'BSIS', major: null, yearLevel: 2, semester: '1st' },
  { code: 'BSIS-DB-2', description: 'Advanced Database Design', units: 3, programCode: 'BSIS', major: null, yearLevel: 2, semester: '1st' },
  { code: 'BSIS-NET-2', description: 'Computer Networks', units: 3, programCode: 'BSIS', major: null, yearLevel: 2, semester: '1st' },
  { code: 'BSIS-SEC-2', description: 'Cybersecurity Basics', units: 3, programCode: 'BSIS', major: null, yearLevel: 2, semester: '1st' },
  
  // ============ COLLEGE BSBA (Year 1-4) ============
  { code: 'BSBA-FM-ACCT-1', description: 'Financial Accounting', units: 3, programCode: 'BSBA', major: 'Financial Management', yearLevel: 1, semester: '1st' },
  { code: 'BSBA-FM-ECON-1', description: 'Microeconomics', units: 3, programCode: 'BSBA', major: 'Financial Management', yearLevel: 1, semester: '1st' },
  { code: 'BSBA-FM-MATH-1', description: 'Business Mathematics', units: 3, programCode: 'BSBA', major: 'Financial Management', yearLevel: 1, semester: '1st' },
  { code: 'BSBA-FM-ENG-1', description: 'Business Communication', units: 3, programCode: 'BSBA', major: 'Financial Management', yearLevel: 1, semester: '1st' },
  
  { code: 'BSBA-MM-MARK-1', description: 'Marketing Fundamentals', units: 3, programCode: 'BSBA', major: 'Marketing Management', yearLevel: 1, semester: '1st' },
  { code: 'BSBA-MM-CONS-1', description: 'Consumer Behavior', units: 3, programCode: 'BSBA', major: 'Marketing Management', yearLevel: 1, semester: '1st' },
  { code: 'BSBA-MM-ECON-1', description: 'Microeconomics', units: 3, programCode: 'BSBA', major: 'Marketing Management', yearLevel: 1, semester: '1st' },
  { code: 'BSBA-MM-ENG-1', description: 'Business Communication', units: 3, programCode: 'BSBA', major: 'Marketing Management', yearLevel: 1, semester: '1st' },
  
  // ============ COLLEGE BSED (Year 1-4) ============
  { code: 'BSED-FIL-PHIL-1', description: 'Philippine Literature', units: 3, programCode: 'BSED', major: 'Filipino', yearLevel: 1, semester: '1st' },
  { code: 'BSED-FIL-GRAM-1', description: 'Filipino Grammar', units: 3, programCode: 'BSED', major: 'Filipino', yearLevel: 1, semester: '1st' },
  { code: 'BSED-FIL-COMP-1', description: 'Filipino Composition', units: 3, programCode: 'BSED', major: 'Filipino', yearLevel: 1, semester: '1st' },
  
  { code: 'BSED-ENG-LIT-1', description: 'English Literature', units: 3, programCode: 'BSED', major: 'English', yearLevel: 1, semester: '1st' },
  { code: 'BSED-ENG-GRAM-1', description: 'English Grammar', units: 3, programCode: 'BSED', major: 'English', yearLevel: 1, semester: '1st' },
  { code: 'BSED-ENG-COMP-1', description: 'English Composition', units: 3, programCode: 'BSED', major: 'English', yearLevel: 1, semester: '1st' },
  
  { code: 'BSED-MATH-ALG-1', description: 'Algebra', units: 3, programCode: 'BSED', major: 'Math', yearLevel: 1, semester: '1st' },
  { code: 'BSED-MATH-GEOM-1', description: 'Geometry', units: 3, programCode: 'BSED', major: 'Math', yearLevel: 1, semester: '1st' },
  { code: 'BSED-MATH-TRIG-1', description: 'Trigonometry', units: 3, programCode: 'BSED', major: 'Math', yearLevel: 1, semester: '1st' },
];

(async () => {
  try {
    console.log('🌱 Seeding subjects...');
    
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
    
    // Clear existing subjects
    await Subject.destroy({ where: {} });
    
    // Seed new subjects
    await Subject.bulkCreate(subjects);
    
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
    
    console.log(`✅ Successfully seeded ${subjects.length} subjects!`);
    console.log('   - SHS STEM: 12 subjects');
    console.log('   - SHS ABM: 9 subjects');
    console.log('   - SHS HUMSS: 8 subjects');
    console.log('   - College BSIS: 9 subjects');
    console.log('   - College BSBA: 8 subjects');
    console.log('   - College BSED: 9 subjects');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding subjects:', error);
    process.exit(1);
  }
})();
