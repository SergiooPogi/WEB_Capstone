/**
 * Test Data Seed Script
 * - Clears all sections and Sergio's enrollments
 * - Creates fresh sections for all levels/strands/courses
 * - Creates test enrollments covering all scenarios
 *
 * Run: node seed-test-data.js
 */

import { sequelize } from './models/db.js';

async function seed() {
  console.log('🌱 Starting seed...\n');

  // ── 1. Find Sergio's user account ──────────────────────────────────────────
  const [[sergio]] = await sequelize.query(
    `SELECT id, name, email FROM users WHERE email LIKE '%sergio%' OR name LIKE '%Sergio%' LIMIT 1`
  );

  if (!sergio) {
    console.error('❌ Sergio Folloso account not found. Make sure he is registered.');
    process.exit(1);
  }
  console.log(`✅ Found user: ${sergio.name} (ID: ${sergio.id})`);

  // ── 2. Clear all sections ──────────────────────────────────────────────────
  await sequelize.query(`DELETE FROM sections`);
  console.log('🗑️  Cleared all sections');

  // ── 3. Clear Sergio's enrollments ─────────────────────────────────────────
  // Delete related records first to avoid FK constraint errors
  const [sergioEnrollments] = await sequelize.query(
    `SELECT id FROM enrollment_records WHERE userId = ?`,
    { replacements: [sergio.id] }
  );
  for (const e of sergioEnrollments) {
    await sequelize.query(`DELETE FROM enrollment_subjects WHERE enrollmentId = ?`, { replacements: [e.id] }).catch(() => {});
    await sequelize.query(`DELETE FROM enrollment_documents WHERE enrollmentId = ?`, { replacements: [e.id] }).catch(() => {});
  }
  await sequelize.query(
    `DELETE FROM enrollment_records WHERE userId = ?`,
    { replacements: [sergio.id] }
  );
  console.log(`🗑️  Cleared enrollments for ${sergio.name}\n`);

  // ── 4. Create fresh sections ───────────────────────────────────────────────
  const now = `datetime('now')`;

  const sections = [
    // JHS — one per grade
    { code: 'JHS-7A',        course: 'JHS', yearLevel: 7,  strand: null,             semester: '1st', schoolYear: '2025-2026' },
    { code: 'JHS-8A',        course: 'JHS', yearLevel: 8,  strand: null,             semester: '1st', schoolYear: '2025-2026' },
    { code: 'JHS-9A',        course: 'JHS', yearLevel: 9,  strand: null,             semester: '1st', schoolYear: '2025-2026' },
    { code: 'JHS-10A',       course: 'JHS', yearLevel: 10, strand: null,             semester: '1st', schoolYear: '2025-2026' },
    // SHS Grade 11 — all strands
    { code: 'SHS-11-STEM',   course: 'SHS', yearLevel: 11, strand: 'STEM',           semester: '1st', schoolYear: '2025-2026' },
    { code: 'SHS-11-ABM',    course: 'SHS', yearLevel: 11, strand: 'ABM',            semester: '1st', schoolYear: '2025-2026' },
    { code: 'SHS-11-HUMSS',  course: 'SHS', yearLevel: 11, strand: 'HUMSS',          semester: '1st', schoolYear: '2025-2026' },
    { code: 'SHS-11-TVL',    course: 'SHS', yearLevel: 11, strand: 'TVL',            semester: '1st', schoolYear: '2025-2026' },
    { code: 'SHS-11-SPORTS', course: 'SHS', yearLevel: 11, strand: 'Sports',         semester: '1st', schoolYear: '2025-2026' },
    { code: 'SHS-11-ARTS',   course: 'SHS', yearLevel: 11, strand: 'Arts and Design',semester: '1st', schoolYear: '2025-2026' },
    // SHS Grade 12 — all strands
    { code: 'SHS-12-STEM',   course: 'SHS', yearLevel: 12, strand: 'STEM',           semester: '1st', schoolYear: '2025-2026' },
    { code: 'SHS-12-ABM',    course: 'SHS', yearLevel: 12, strand: 'ABM',            semester: '1st', schoolYear: '2025-2026' },
    { code: 'SHS-12-HUMSS',  course: 'SHS', yearLevel: 12, strand: 'HUMSS',          semester: '1st', schoolYear: '2025-2026' },
    { code: 'SHS-12-TVL',    course: 'SHS', yearLevel: 12, strand: 'TVL',            semester: '1st', schoolYear: '2025-2026' },
    { code: 'SHS-12-SPORTS', course: 'SHS', yearLevel: 12, strand: 'Sports',         semester: '1st', schoolYear: '2025-2026' },
    { code: 'SHS-12-ARTS',   course: 'SHS', yearLevel: 12, strand: 'Arts and Design',semester: '1st', schoolYear: '2025-2026' },
    // College — one per course
    { code: 'BEED-1A',       course: 'BEED',   yearLevel: 1, strand: null, semester: '1st', schoolYear: '2025-2026' },
    { code: 'BSIS-1A',       course: 'BSIS',   yearLevel: 1, strand: null, semester: '1st', schoolYear: '2025-2026' },
    { code: 'BSBA-1A',       course: 'BSBA',   yearLevel: 1, strand: null, semester: '1st', schoolYear: '2025-2026' },
    { code: 'BSED-1A',       course: 'BSED',   yearLevel: 1, strand: null, semester: '1st', schoolYear: '2025-2026' },
    { code: 'BSCrim-1A',     course: 'BSCrim', yearLevel: 1, strand: null, semester: '1st', schoolYear: '2025-2026' },
  ];

  for (const s of sections) {
    await sequelize.query(
      `INSERT INTO sections (code, course, yearLevel, strand, semester, schoolYear, capacity, currentEnrollment, isActive, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?, 40, 0, 1, datetime('now'), datetime('now'))`,
      { replacements: [s.code, s.course, s.yearLevel, s.strand, s.semester, s.schoolYear] }
    );
    console.log(`  ✅ Section: ${s.code}`);
  }
  console.log(`\n📚 Created ${sections.length} sections\n`);

  // ── 5. Create test enrollments ─────────────────────────────────────────────
  const uid = sergio.id;
  const base = {
    familyName: 'Folloso', firstName: 'Sergio', middleName: 'T',
    sex: 'Male', dateOfBirth: '2005-03-15', placeOfBirth: 'Calapan City',
    academicYear: '2025-2026', semester: '1',
    fatherName: 'Juan Folloso', motherName: 'Maria Folloso',
  };

  const enrollments = [
    // ── JHS ──────────────────────────────────────────────────────────────────
    // Grade 7 — SSC applied, QUALIFIED (avg 90) → pending_exam
    {
      ...base, educationLevel: 'JHS', gradeLevel: 'Grade 7',
      enrollmentType: 'first-time', studentType: 'New',
      sscApplied: 1, sscQualified: 1, grade6Average: '90',
      status: 'submitted',
      note: 'JHS Grade 7 - SSC Qualified (avg 90)'
    },
    // Grade 7 — SSC applied, NOT QUALIFIED (avg 75) → submitted
    {
      ...base, educationLevel: 'JHS', gradeLevel: 'Grade 7',
      enrollmentType: 'first-time', studentType: 'New',
      sscApplied: 1, sscQualified: 0, grade6Average: '75', sscClass: 'Regular',
      status: 'submitted',
      note: 'JHS Grade 7 - SSC Not Qualified (avg 75)'
    },
    // Grade 7 — SSC NOT applied
    {
      ...base, educationLevel: 'JHS', gradeLevel: 'Grade 7',
      enrollmentType: 'first-time', studentType: 'New',
      sscApplied: 0, grade6Average: '88',
      status: 'submitted',
      note: 'JHS Grade 7 - No SSC'
    },
    // Grade 8
    {
      ...base, educationLevel: 'JHS', gradeLevel: 'Grade 8',
      enrollmentType: 'continuing', studentType: 'Old',
      status: 'submitted', note: 'JHS Grade 8'
    },
    // Grade 9
    {
      ...base, educationLevel: 'JHS', gradeLevel: 'Grade 9',
      enrollmentType: 'continuing', studentType: 'Old',
      status: 'submitted', note: 'JHS Grade 9'
    },
    // Grade 10
    {
      ...base, educationLevel: 'JHS', gradeLevel: 'Grade 10',
      enrollmentType: 'continuing', studentType: 'Old',
      status: 'submitted', note: 'JHS Grade 10'
    },

    // ── SHS ──────────────────────────────────────────────────────────────────
    { ...base, educationLevel: 'SHS', gradeLevel: 'Grade 11', strand: 'STEM',            enrollmentType: 'first-time', studentType: 'New', status: 'submitted', note: 'SHS G11 STEM' },
    { ...base, educationLevel: 'SHS', gradeLevel: 'Grade 11', strand: 'ABM',             enrollmentType: 'first-time', studentType: 'New', status: 'submitted', note: 'SHS G11 ABM' },
    { ...base, educationLevel: 'SHS', gradeLevel: 'Grade 11', strand: 'HUMSS',           enrollmentType: 'first-time', studentType: 'New', status: 'submitted', note: 'SHS G11 HUMSS' },
    { ...base, educationLevel: 'SHS', gradeLevel: 'Grade 11', strand: 'TVL',             enrollmentType: 'first-time', studentType: 'New', status: 'submitted', note: 'SHS G11 TVL' },
    { ...base, educationLevel: 'SHS', gradeLevel: 'Grade 11', strand: 'Sports',          enrollmentType: 'first-time', studentType: 'New', status: 'submitted', note: 'SHS G11 Sports' },
    { ...base, educationLevel: 'SHS', gradeLevel: 'Grade 11', strand: 'Arts and Design', enrollmentType: 'first-time', studentType: 'New', status: 'submitted', note: 'SHS G11 Arts' },
    { ...base, educationLevel: 'SHS', gradeLevel: 'Grade 12', strand: 'STEM',            enrollmentType: 'continuing', studentType: 'Old', status: 'submitted', note: 'SHS G12 STEM' },
    { ...base, educationLevel: 'SHS', gradeLevel: 'Grade 12', strand: 'ABM',             enrollmentType: 'continuing', studentType: 'Old', status: 'submitted', note: 'SHS G12 ABM' },
    { ...base, educationLevel: 'SHS', gradeLevel: 'Grade 12', strand: 'HUMSS',           enrollmentType: 'continuing', studentType: 'Old', status: 'submitted', note: 'SHS G12 HUMSS' },
    { ...base, educationLevel: 'SHS', gradeLevel: 'Grade 12', strand: 'TVL',             enrollmentType: 'continuing', studentType: 'Old', status: 'submitted', note: 'SHS G12 TVL' },
    { ...base, educationLevel: 'SHS', gradeLevel: 'Grade 12', strand: 'Sports',          enrollmentType: 'continuing', studentType: 'Old', status: 'submitted', note: 'SHS G12 Sports' },
    { ...base, educationLevel: 'SHS', gradeLevel: 'Grade 12', strand: 'Arts and Design', enrollmentType: 'continuing', studentType: 'Old', status: 'submitted', note: 'SHS G12 Arts' },

    // ── College ───────────────────────────────────────────────────────────────
    { ...base, educationLevel: 'College', course: 'BEED',   enrollmentType: 'first-time', studentType: 'New', status: 'submitted', note: 'College BEED first-time' },
    { ...base, educationLevel: 'College', course: 'BSIS',   enrollmentType: 'continuing', studentType: 'Old', studentStatus: 'regular',   status: 'submitted', note: 'College BSIS continuing regular' },
    { ...base, educationLevel: 'College', course: 'BSBA',   enrollmentType: 'continuing', studentType: 'Old', studentStatus: 'irregular', status: 'submitted', note: 'College BSBA continuing irregular' },
    { ...base, educationLevel: 'College', course: 'BSED',   enrollmentType: 'transferee', studentType: 'New', status: 'submitted', note: 'College BSED transferee' },
    { ...base, educationLevel: 'College', course: 'BSCrim', enrollmentType: 'returnee',   studentType: 'Old', status: 'submitted', note: 'College BSCrim returnee' },
  ];

  let created = 0;
  for (const e of enrollments) {
    const { note, ...data } = e;
    await sequelize.query(
      `INSERT INTO enrollment_records
        (userId, educationLevel, gradeLevel, strand, course, enrollmentType, studentType, studentStatus,
         sscApplied, sscQualified, sscClass, grade6Average,
         familyName, firstName, middleName, sex, dateOfBirth, placeOfBirth,
         academicYear, semester, fatherName, motherName,
         status, admissionCredentials, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?,
               ?, ?, ?, ?,
               ?, ?, ?, ?, ?, ?,
               ?, ?, ?, ?,
               ?, '[]', datetime('now'), datetime('now'))`,
      {
        replacements: [
          uid,
          data.educationLevel || null,
          data.gradeLevel || null,
          data.strand || null,
          data.course || null,
          data.enrollmentType || null,
          data.studentType || null,
          data.studentStatus || null,
          data.sscApplied || 0,
          data.sscQualified !== undefined ? data.sscQualified : null,
          data.sscClass || null,
          data.grade6Average || null,
          data.familyName, data.firstName, data.middleName,
          data.sex, data.dateOfBirth, data.placeOfBirth,
          data.academicYear, data.semester,
          data.fatherName, data.motherName,
          data.status,
        ]
      }
    );
    console.log(`  ✅ Enrollment: ${note}`);
    created++;
  }

  console.log(`\n🎓 Created ${created} test enrollments for ${sergio.name}`);
  console.log('\n✅ Seed complete!\n');
  console.log('Next steps:');
  console.log('  1. Log in as registrar → verify each enrollment');
  console.log('  2. Log in as admin → approve each enrollment');
  console.log('  3. Watch auto-assign fire and sections fill up');
  console.log('  4. Check Section Management → each section should show 1 student\n');

  process.exit(0);
}

seed().catch(err => {
  console.error('❌ Seed failed:', err.message);
  process.exit(1);
});
