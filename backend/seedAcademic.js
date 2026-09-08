import { sequelize } from './models/db.js';
import { Program } from './models/programModel.js';
import { Subject } from './models/subjectModel.js';
import { SchoolYear } from './models/schoolYearModel.js';

await sequelize.authenticate();

// Seed school year
await SchoolYear.findOrCreate({ where: { year: '2025-2026' }, defaults: { isActive: true } });
console.log('✅ School year seeded');

// Seed programs
const programs = [
  { code: 'BEED', name: 'Bachelor of Elementary Education', majors: [] },
  { code: 'BSIS', name: 'Bachelor of Science in Information Systems', majors: [] },
  { code: 'BSBA', name: 'Bachelor of Science in Business Administration', majors: ['Financial Management', 'Marketing Management'] },
  { code: 'BSED', name: 'Bachelor of Secondary Education', majors: ['Filipino', 'English', 'Mathematics', 'Science', 'Social Studies'] },
  { code: 'BSCrim', name: 'Bachelor of Science in Criminology', majors: [] },
];
for (const p of programs) await Program.findOrCreate({ where: { code: p.code }, defaults: p });
console.log('✅ Programs seeded');

// Subjects per program
const subjects = [
  // BSED Year 1 Sem 1
  { code: 'GEC001', description: 'Understanding the Self', units: 3, programCode: 'BSED', gradeLevel: 1, semester: '1st' },
  { code: 'GEC002', description: 'Readings in Philippine History', units: 3, programCode: 'BSED', gradeLevel: 1, semester: '1st' },
  { code: 'GEC003', description: 'The Contemporary World', units: 3, programCode: 'BSED', gradeLevel: 1, semester: '1st' },
  { code: 'PROF001', description: 'Child and Adolescent Learners', units: 3, programCode: 'BSED', gradeLevel: 1, semester: '1st' },
  { code: 'PROF002', description: 'The Teaching Profession', units: 3, programCode: 'BSED', gradeLevel: 1, semester: '1st' },
  { code: 'PE001', description: 'Physical Education 1', units: 2, programCode: 'BSED', gradeLevel: 1, semester: '1st' },
  // BSED Year 1 Sem 2
  { code: 'GEC004', description: 'Mathematics in the Modern World', units: 3, programCode: 'BSED', gradeLevel: 1, semester: '2nd' },
  { code: 'GEC005', description: 'Purposive Communication', units: 3, programCode: 'BSED', gradeLevel: 1, semester: '2nd' },
  { code: 'PROF003', description: 'The School Curriculum', units: 3, programCode: 'BSED', gradeLevel: 1, semester: '2nd' },
  { code: 'PROF004', description: 'Facilitating Learner-Centered Teaching', units: 3, programCode: 'BSED', gradeLevel: 1, semester: '2nd' },
  { code: 'PE002', description: 'Physical Education 2', units: 2, programCode: 'BSED', gradeLevel: 1, semester: '2nd' },
  // BSED Year 2 Sem 1
  { code: 'GEC006', description: 'Art Appreciation', units: 3, programCode: 'BSED', gradeLevel: 2, semester: '1st' },
  { code: 'GEC007', description: 'Science, Technology and Society', units: 3, programCode: 'BSED', gradeLevel: 2, semester: '1st' },
  { code: 'PROF005', description: 'Assessment in Learning 1', units: 3, programCode: 'BSED', gradeLevel: 2, semester: '1st' },
  { code: 'PROF006', description: 'Technology for Teaching and Learning 1', units: 3, programCode: 'BSED', gradeLevel: 2, semester: '1st' },
  { code: 'NSTP001', description: 'NSTP 1', units: 3, programCode: 'BSED', gradeLevel: 2, semester: '1st' },
  // BSED Year 2 Sem 2
  { code: 'PROF007', description: 'Assessment in Learning 2', units: 3, programCode: 'BSED', gradeLevel: 2, semester: '2nd' },
  { code: 'PROF008', description: 'Technology for Teaching and Learning 2', units: 3, programCode: 'BSED', gradeLevel: 2, semester: '2nd' },
  { code: 'PROF009', description: 'Building and Enhancing New Literacies', units: 3, programCode: 'BSED', gradeLevel: 2, semester: '2nd' },
  { code: 'NSTP002', description: 'NSTP 2', units: 3, programCode: 'BSED', gradeLevel: 2, semester: '2nd' },

  // BEED Year 1 Sem 1
  { code: 'BEED001', description: 'Understanding the Self', units: 3, programCode: 'BEED', gradeLevel: 1, semester: '1st' },
  { code: 'BEED002', description: 'Child and Adolescent Learners', units: 3, programCode: 'BEED', gradeLevel: 1, semester: '1st' },
  { code: 'BEED003', description: 'The Teaching Profession', units: 3, programCode: 'BEED', gradeLevel: 1, semester: '1st' },
  { code: 'BEED004', description: 'Purposive Communication', units: 3, programCode: 'BEED', gradeLevel: 1, semester: '1st' },
  { code: 'BEED005', description: 'Mathematics in the Modern World', units: 3, programCode: 'BEED', gradeLevel: 1, semester: '1st' },
  // BEED Year 1 Sem 2
  { code: 'BEED006', description: 'The School Curriculum', units: 3, programCode: 'BEED', gradeLevel: 1, semester: '2nd' },
  { code: 'BEED007', description: 'Facilitating Learner-Centered Teaching', units: 3, programCode: 'BEED', gradeLevel: 1, semester: '2nd' },
  { code: 'BEED008', description: 'Readings in Philippine History', units: 3, programCode: 'BEED', gradeLevel: 1, semester: '2nd' },
  { code: 'BEED009', description: 'Art Appreciation', units: 3, programCode: 'BEED', gradeLevel: 1, semester: '2nd' },

  // BSIS Year 1 Sem 1
  { code: 'IS001', description: 'Introduction to Computing', units: 3, programCode: 'BSIS', gradeLevel: 1, semester: '1st' },
  { code: 'IS002', description: 'Computer Programming 1', units: 3, programCode: 'BSIS', gradeLevel: 1, semester: '1st' },
  { code: 'IS003', description: 'Mathematics in the Modern World', units: 3, programCode: 'BSIS', gradeLevel: 1, semester: '1st' },
  { code: 'IS004', description: 'Understanding the Self', units: 3, programCode: 'BSIS', gradeLevel: 1, semester: '1st' },
  { code: 'IS005', description: 'Purposive Communication', units: 3, programCode: 'BSIS', gradeLevel: 1, semester: '1st' },
  // BSIS Year 1 Sem 2
  { code: 'IS006', description: 'Computer Programming 2', units: 3, programCode: 'BSIS', gradeLevel: 1, semester: '2nd' },
  { code: 'IS007', description: 'Data Structures and Algorithms', units: 3, programCode: 'BSIS', gradeLevel: 1, semester: '2nd' },
  { code: 'IS008', description: 'Information Management', units: 3, programCode: 'BSIS', gradeLevel: 1, semester: '2nd' },
  { code: 'IS009', description: 'Discrete Mathematics', units: 3, programCode: 'BSIS', gradeLevel: 1, semester: '2nd' },
  // BSIS Year 2 Sem 1
  { code: 'IS010', description: 'Object-Oriented Programming', units: 3, programCode: 'BSIS', gradeLevel: 2, semester: '1st' },
  { code: 'IS011', description: 'Systems Analysis and Design', units: 3, programCode: 'BSIS', gradeLevel: 2, semester: '1st' },
  { code: 'IS012', description: 'Database Management Systems', units: 3, programCode: 'BSIS', gradeLevel: 2, semester: '1st' },
  { code: 'IS013', description: 'Web Development 1', units: 3, programCode: 'BSIS', gradeLevel: 2, semester: '1st' },

  // BSBA Year 1 Sem 1
  { code: 'BA001', description: 'Principles of Management', units: 3, programCode: 'BSBA', gradeLevel: 1, semester: '1st' },
  { code: 'BA002', description: 'Business Mathematics', units: 3, programCode: 'BSBA', gradeLevel: 1, semester: '1st' },
  { code: 'BA003', description: 'Fundamentals of Accounting', units: 3, programCode: 'BSBA', gradeLevel: 1, semester: '1st' },
  { code: 'BA004', description: 'Understanding the Self', units: 3, programCode: 'BSBA', gradeLevel: 1, semester: '1st' },
  { code: 'BA005', description: 'Purposive Communication', units: 3, programCode: 'BSBA', gradeLevel: 1, semester: '1st' },
  // BSBA Year 1 Sem 2
  { code: 'BA006', description: 'Business Economics', units: 3, programCode: 'BSBA', gradeLevel: 1, semester: '2nd' },
  { code: 'BA007', description: 'Business Law', units: 3, programCode: 'BSBA', gradeLevel: 1, semester: '2nd' },
  { code: 'BA008', description: 'Financial Accounting', units: 3, programCode: 'BSBA', gradeLevel: 1, semester: '2nd' },
  { code: 'BA009', description: 'Marketing Management', units: 3, programCode: 'BSBA', gradeLevel: 1, semester: '2nd' },

  // BSCrim Year 1 Sem 1
  { code: 'CRIM001', description: 'Introduction to Criminology', units: 3, programCode: 'BSCrim', gradeLevel: 1, semester: '1st' },
  { code: 'CRIM002', description: 'Criminal Law 1', units: 3, programCode: 'BSCrim', gradeLevel: 1, semester: '1st' },
  { code: 'CRIM003', description: 'Understanding the Self', units: 3, programCode: 'BSCrim', gradeLevel: 1, semester: '1st' },
  { code: 'CRIM004', description: 'Purposive Communication', units: 3, programCode: 'BSCrim', gradeLevel: 1, semester: '1st' },
  { code: 'CRIM005', description: 'Mathematics in the Modern World', units: 3, programCode: 'BSCrim', gradeLevel: 1, semester: '1st' },
  // BSCrim Year 1 Sem 2
  { code: 'CRIM006', description: 'Criminal Law 2', units: 3, programCode: 'BSCrim', gradeLevel: 1, semester: '2nd' },
  { code: 'CRIM007', description: 'Law Enforcement Administration', units: 3, programCode: 'BSCrim', gradeLevel: 1, semester: '2nd' },
  { code: 'CRIM008', description: 'Criminalistics 1', units: 3, programCode: 'BSCrim', gradeLevel: 1, semester: '2nd' },
  { code: 'CRIM009', description: 'Readings in Philippine History', units: 3, programCode: 'BSCrim', gradeLevel: 1, semester: '2nd' },
];

for (const s of subjects) {
  await Subject.findOrCreate({ where: { code: s.code, programCode: s.programCode }, defaults: s });
}
console.log(`✅ ${subjects.length} subjects seeded`);
console.log('\n🎉 Academic structure ready!');
process.exit(0);
