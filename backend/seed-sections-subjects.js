/**
 * Seed sections, subjects, and school year for testing
 * Run: node seed-sections-subjects.js
 */

import { sequelize } from './models/db.js';
import { Section } from './models/sectionModel.js';
import { Subject } from './models/subjectModel.js';
import { SchoolYear } from './models/schoolYearModel.js';

await sequelize.sync();
console.log('🌱 Seeding sections, subjects, and school year...\n');

// ── School Year ───────────────────────────────────────────────────────────────
try {
  const existing = await SchoolYear.findOne({ where: { year: '2025-2026' } });
  if (!existing) {
    await SchoolYear.create({ year: '2025-2026', isActive: true });
    console.log('✅ School year 2025-2026 created and set as active');
  } else {
    await SchoolYear.update({ isActive: false }, { where: {} });
    await SchoolYear.update({ isActive: true }, { where: { year: '2025-2026' } });
    console.log('✅ School year 2025-2026 set as active');
  }
} catch (err) {
  console.log('⚠️  School year error:', err.message);
}

// ── Sections ──────────────────────────────────────────────────────────────────
const sections = [
  { code: 'JHS-7A',  course: 'JHS', yearLevel: 7,  strand: 'SSC',   semester: '1st', schoolYear: '2025-2026', capacity: 30 },
  { code: 'JHS-7B',  course: 'JHS', yearLevel: 7,  strand: null,    semester: '1st', schoolYear: '2025-2026', capacity: 40 },
  { code: 'JHS-8A',  course: 'JHS', yearLevel: 8,  strand: null,    semester: '1st', schoolYear: '2025-2026', capacity: 40 },
  { code: 'JHS-8B',  course: 'JHS', yearLevel: 8,  strand: null,    semester: '1st', schoolYear: '2025-2026', capacity: 40 },
  { code: 'JHS-9A',  course: 'JHS', yearLevel: 9,  strand: null,    semester: '1st', schoolYear: '2025-2026', capacity: 40 },
  { code: 'JHS-10A', course: 'JHS', yearLevel: 10, strand: null,    semester: '1st', schoolYear: '2025-2026', capacity: 40 },
  { code: 'SHS-11A', course: 'SHS', yearLevel: 11, strand: 'STEM',  semester: '1st', schoolYear: '2025-2026', capacity: 35 },
  { code: 'SHS-11B', course: 'SHS', yearLevel: 11, strand: 'ABM',   semester: '1st', schoolYear: '2025-2026', capacity: 35 },
  { code: 'SHS-11C', course: 'SHS', yearLevel: 11, strand: 'HUMSS', semester: '1st', schoolYear: '2025-2026', capacity: 35 },
  { code: 'SHS-12A', course: 'SHS', yearLevel: 12, strand: 'STEM',  semester: '1st', schoolYear: '2025-2026', capacity: 35 },
  { code: 'SHS-12B', course: 'SHS', yearLevel: 12, strand: 'ABM',   semester: '1st', schoolYear: '2025-2026', capacity: 35 },
  { code: 'SHS-12C', course: 'SHS', yearLevel: 12, strand: 'HUMSS', semester: '1st', schoolYear: '2025-2026', capacity: 35 },
];

let sectionsCreated = 0, sectionsSkipped = 0;
for (const s of sections) {
  const existing = await Section.findOne({ where: { code: s.code, schoolYear: s.schoolYear } });
  if (existing) { sectionsSkipped++; continue; }
  await Section.create({ ...s, instructor: null, schedule: null, room: null, currentEnrollment: 0, isActive: true });
  sectionsCreated++;
}
console.log(`✅ Sections: ${sectionsCreated} created, ${sectionsSkipped} already existed`);

// ── Subjects ──────────────────────────────────────────────────────────────────
// NOTE: Subject.code must be unique across all records.
// Format: PROG-SUBJCODE-G{grade}  e.g. JHS-MATH-G7, SHS-STEM-GENMATH-G11

const jhsCoreSubjects = [
  { key: 'FIL',   description: 'Filipino',                               units: 1.5 },
  { key: 'ENG',   description: 'English',                                 units: 1.5 },
  { key: 'MATH',  description: 'Mathematics',                             units: 1.5 },
  { key: 'SCI',   description: 'Science',                                 units: 1.5 },
  { key: 'AP',    description: 'Araling Panlipunan',                      units: 1.5 },
  { key: 'MAPEH', description: 'MAPEH',                                   units: 1.0 },
  { key: 'TLE',   description: 'Technology and Livelihood Education',     units: 1.0 },
  { key: 'ESP',   description: 'Edukasyon sa Pagpapakatao',               units: 1.0 },
];

const shsSubjects = {
  STEM: [
    { key: 'GENMATH',  description: 'General Mathematics',    units: 3 },
    { key: 'ELS',      description: 'Earth and Life Science', units: 3 },
    { key: 'ORAL',     description: 'Oral Communication',     units: 3 },
    { key: 'PE',       description: 'Physical Education',     units: 2 },
    { key: 'READING',  description: 'Reading and Writing',    units: 3 },
  ],
  ABM: [
    { key: 'GENMATH',  description: 'General Mathematics',    units: 3 },
    { key: 'BUSMATH',  description: 'Business Mathematics',   units: 3 },
    { key: 'ORAL',     description: 'Oral Communication',     units: 3 },
    { key: 'PE',       description: 'Physical Education',     units: 2 },
    { key: 'READING',  description: 'Reading and Writing',    units: 3 },
  ],
  HUMSS: [
    { key: 'SOCL',     description: 'Introduction to World Religions and Belief Systems', units: 3 },
    { key: 'ORAL',     description: 'Oral Communication',     units: 3 },
    { key: 'FIL',      description: 'Pagbasa at Pagsulat sa Iba\'t Ibang Disiplina', units: 3 },
    { key: 'PE',       description: 'Physical Education',     units: 2 },
    { key: 'READING',  description: 'Reading and Writing',    units: 3 },
  ],
};

let subjectsCreated = 0, subjectsSkipped = 0;

async function seedSubject(data) {
  const existing = await Subject.findOne({ where: { code: data.code } });
  if (existing) { subjectsSkipped++; return; }
  await Subject.create({ ...data, isActive: true });
  subjectsCreated++;
}

// JHS subjects — grade 7 to 10
for (const grade of [7, 8, 9, 10]) {
  for (const subj of jhsCoreSubjects) {
    await seedSubject({
      code: `JHS-${subj.key}-G${grade}`,
      description: subj.description,
      units: subj.units,
      programCode: 'JHS',
      gradeLevel: grade,
      semester: '1st',
      strand: null,
    });
  }
}

// SHS subjects — grades 11 and 12, per strand
for (const strand of ['STEM', 'ABM', 'HUMSS']) {
  for (const grade of [11, 12]) {
    for (const subj of shsSubjects[strand]) {
      await seedSubject({
        code: `SHS-${strand}-${subj.key}-G${grade}`,
        description: subj.description,
        units: subj.units,
        programCode: 'SHS',
        gradeLevel: grade,
        semester: '1st',
        strand: strand,
      });
    }
  }
}

console.log(`✅ Subjects: ${subjectsCreated} created, ${subjectsSkipped} already existed`);

// ── Summary ───────────────────────────────────────────────────────────────────
console.log('\n🎉 Seeding complete!\n');
console.log('📋 Sections:');
sections.forEach(s => {
  const type = s.strand || 'Regular';
  console.log(`   ${s.code.padEnd(10)} Grade ${s.yearLevel} ${s.course} · ${type} · Cap: ${s.capacity}`);
});
console.log('\n📚 Subjects: JHS (8 subjects × 4 grades = 32) + SHS (5 subjects × 3 strands × 2 grades = 30)');
console.log('   Total subjects:', subjectsCreated + subjectsSkipped);

await sequelize.close();
process.exit(0);
