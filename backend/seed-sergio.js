/**
 * Seed script: Clear all enrollments and create comprehensive test data for Sergio (userId=5)
 * Covers every variant: JHS (SSC qualified, not qualified), SHS (STEM, ABM, HUMSS), College (all types)
 */
import { sequelize } from './models/db.js';

// ── Clear all enrollment data ─────────────────────────────────────────────────
await sequelize.query('DELETE FROM enrollment_subjects');
await sequelize.query('DELETE FROM enrollment_records');
console.log('✅ Cleared all enrollment records\n');

// ── Shared personal info for Sergio ──────────────────────────────────────────
const personal = {
  userId: 5,
  firstName: 'Sergio',
  familyName: 'Folloso',
  middleName: 'Dela Cruz',
  sex: 'Male',
  dateOfBirth: '2005-03-15',
  placeOfBirth: 'Calapan City, Oriental Mindoro',
  email: 'sergiofolloso0@gmail.com',
  mobileNumber: '09171234567',
  fatherName: 'Roberto Folloso',
  fatherOccupation: 'Engineer',
  fatherAddress: 'Brgy. Mahal Na Pangalan, Calapan City',
  motherName: 'Maria Folloso',
  motherOccupation: 'Teacher',
  motherAddress: 'Brgy. Mahal Na Pangalan, Calapan City',
  guardianName: 'Roberto Folloso',
  guardianOccupation: 'Engineer',
  guardianAddress: 'Brgy. Mahal Na Pangalan, Calapan City',
  guardianTelephone: '043-288-1234',
  parentsAddress: 'Brgy. Mahal Na Pangalan, Calapan City, Oriental Mindoro',
  admissionCredentials: JSON.stringify(['f138', 'f137a', 'cert', 'birthCert']),
  academicYear: '2025-2026',
  semester: '1st Semester',
  dateEnrolled: '2025-06-10',
  completion_percentage: 100,
};

const enrollments = [

  // ── 1. JHS Grade 7 — SSC QUALIFIED (grade6Average >= 85) ─────────────────
  {
    ...personal,
    educationLevel: 'JHS',
    gradeLevel: '7',
    lrn: '123456789012',
    studentType: 'New',
    studentNumber: 'JHS-2025-001',
    status: 'submitted',
    sscApplied: 1,
    sscQualified: 1,
    grade6Average: '92.50',
    grade6Remarks: 'With Honors',
    grade6School: 'Calapan City Elementary School',
    grade6SchoolAddress: 'Calapan City, Oriental Mindoro',
    grade6Section: 'Sampaguita',
    grade6SYStart: '2024',
    grade6SYEnd: '2025',
    sscPassingScore: 75,
    admissionCredentials: JSON.stringify(['f138', 'f137a', 'cert', 'f137e']),
  },

  // ── 2. JHS Grade 7 — SSC NOT QUALIFIED (grade6Average < 85) ──────────────
  {
    ...personal,
    educationLevel: 'JHS',
    gradeLevel: '7',
    lrn: '123456789013',
    studentType: 'New',
    studentNumber: 'JHS-2025-002',
    status: 'submitted',
    sscApplied: 1,
    sscQualified: 0,
    grade6Average: '78.00',
    grade6Remarks: 'Passed',
    grade6School: 'Calapan City Elementary School',
    grade6SchoolAddress: 'Calapan City, Oriental Mindoro',
    grade6Section: 'Rosal',
    grade6SYStart: '2024',
    grade6SYEnd: '2025',
    sscPassingScore: 75,
    admissionCredentials: JSON.stringify(['f138', 'f137a', 'cert', 'f137e']),
  },

  // ── 3. JHS Grade 7 — SSC PASSED EXAM (exam scheduled + result recorded) ──
  {
    ...personal,
    educationLevel: 'JHS',
    gradeLevel: '7',
    lrn: '123456789014',
    studentType: 'New',
    studentNumber: 'JHS-2025-003',
    status: 'submitted',
    sscApplied: 1,
    sscQualified: 1,
    grade6Average: '95.00',
    grade6Remarks: 'With High Honors',
    grade6School: 'Calapan City Elementary School',
    grade6SchoolAddress: 'Calapan City, Oriental Mindoro',
    grade6Section: 'Ilang-Ilang',
    grade6SYStart: '2024',
    grade6SYEnd: '2025',
    sscPassingScore: 75,
    sscExamDate: '2025-07-15',
    sscExamScore: 88,
    sscResult: 'passed',
    sscClass: 'SSC',
    admissionCredentials: JSON.stringify(['f138', 'f137a', 'cert', 'f137e']),
  },

  // ── 4. JHS Grade 7 — SSC FAILED EXAM (assigned to Regular) ───────────────
  {
    ...personal,
    educationLevel: 'JHS',
    gradeLevel: '7',
    lrn: '123456789015',
    studentType: 'New',
    studentNumber: 'JHS-2025-004',
    status: 'submitted',
    sscApplied: 1,
    sscQualified: 1,
    grade6Average: '87.00',
    grade6Remarks: 'With Honors',
    grade6School: 'Calapan City Elementary School',
    grade6SchoolAddress: 'Calapan City, Oriental Mindoro',
    grade6Section: 'Dahlia',
    grade6SYStart: '2024',
    grade6SYEnd: '2025',
    sscPassingScore: 75,
    sscExamDate: '2025-07-15',
    sscExamScore: 60,
    sscResult: 'failed',
    sscClass: 'Regular',
    admissionCredentials: JSON.stringify(['f138', 'f137a', 'cert', 'f137e']),
  },

  // ── 5. JHS Grade 7 — PENDING EXAM (exam scheduled, no result yet) ─────────
  {
    ...personal,
    educationLevel: 'JHS',
    gradeLevel: '7',
    lrn: '123456789016',
    studentType: 'New',
    studentNumber: 'JHS-2025-005',
    status: 'pending_exam',
    sscApplied: 1,
    sscQualified: 1,
    grade6Average: '90.00',
    grade6Remarks: 'With High Honors',
    grade6School: 'Calapan City Elementary School',
    grade6SchoolAddress: 'Calapan City, Oriental Mindoro',
    grade6Section: 'Orchid',
    grade6SYStart: '2024',
    grade6SYEnd: '2025',
    sscPassingScore: 75,
    sscExamDate: '2025-08-01',
    admissionCredentials: JSON.stringify(['f138', 'f137a', 'cert', 'f137e']),
  },

  // ── 6. JHS Grade 8 — Regular (no SSC) ────────────────────────────────────
  {
    ...personal,
    educationLevel: 'JHS',
    gradeLevel: '8',
    lrn: '123456789017',
    studentType: 'Old',
    studentNumber: 'JHS-2025-006',
    status: 'submitted',
    sscApplied: 0,
    sscQualified: 0,
    lastHSSchool: 'Eastern Mindoro College',
    lastHSCurriculumYear: 'G7',
    lastHSSection: 'Sampaguita',
    lastHSSYStart: '2024',
    lastHSSYEnd: '2025',
    admissionCredentials: JSON.stringify(['f138', 'f137a', 'cert']),
  },

  // ── 7. JHS Grade 10 — Verified (waiting admin) ────────────────────────────
  {
    ...personal,
    educationLevel: 'JHS',
    gradeLevel: '10',
    lrn: '123456789018',
    studentType: 'Old',
    studentNumber: 'JHS-2025-007',
    status: 'verified',
    sscApplied: 0,
    lastHSSchool: 'Eastern Mindoro College',
    lastHSCurriculumYear: 'G9',
    lastHSSection: 'Rosal',
    lastHSSYStart: '2024',
    lastHSSYEnd: '2025',
    registrar_remarks: 'All documents complete and verified.',
    verified_by: 3,
    verified_at: '2025-06-12 09:30:00',
    admissionCredentials: JSON.stringify(['f138', 'f137a', 'cert']),
  },

  // ── 8. SHS Grade 11 — STEM strand ────────────────────────────────────────
  {
    ...personal,
    educationLevel: 'SHS',
    gradeLevel: '11',
    strand: 'STEM',
    studentType: 'New',
    studentNumber: 'SHS-2025-001',
    status: 'submitted',
    lastHSSchool: 'Eastern Mindoro College',
    lastHSCurriculumYear: 'G10',
    lastHSSection: 'Sampaguita',
    lastHSSYStart: '2024',
    lastHSSYEnd: '2025',
    admissionCredentials: JSON.stringify(['f138', 'f137a', 'cert', 'birthCert']),
  },

  // ── 9. SHS Grade 11 — ABM strand ─────────────────────────────────────────
  {
    ...personal,
    educationLevel: 'SHS',
    gradeLevel: '11',
    strand: 'ABM',
    studentType: 'New',
    studentNumber: 'SHS-2025-002',
    status: 'submitted',
    lastHSSchool: 'Eastern Mindoro College',
    lastHSCurriculumYear: 'G10',
    lastHSSection: 'Rosal',
    lastHSSYStart: '2024',
    lastHSSYEnd: '2025',
    admissionCredentials: JSON.stringify(['f138', 'f137a', 'cert', 'birthCert']),
  },

  // ── 10. SHS Grade 11 — HUMSS strand ──────────────────────────────────────
  {
    ...personal,
    educationLevel: 'SHS',
    gradeLevel: '11',
    strand: 'HUMSS',
    studentType: 'New',
    studentNumber: 'SHS-2025-003',
    status: 'returned',
    lastHSSchool: 'Eastern Mindoro College',
    lastHSCurriculumYear: 'G10',
    lastHSSection: 'Dahlia',
    lastHSSYStart: '2024',
    lastHSSYEnd: '2025',
    registrar_remarks: 'Missing Form 137-A. Please resubmit with complete documents.',
    verified_by: 3,
    verified_at: '2025-06-11 14:00:00',
    admissionCredentials: JSON.stringify(['f138', 'cert', 'birthCert']),
  },

  // ── 11. SHS Grade 12 — STEM, 2nd Semester, Approved ──────────────────────
  {
    ...personal,
    educationLevel: 'SHS',
    gradeLevel: '12',
    strand: 'STEM',
    semester: '2nd Semester',
    studentType: 'Old',
    studentNumber: 'SHS-2025-004',
    status: 'approved',
    lastHSSchool: 'Eastern Mindoro College',
    lastHSCurriculumYear: 'G11',
    lastHSSection: 'Orchid',
    lastHSSYStart: '2024',
    lastHSSYEnd: '2025',
    registrar_remarks: 'All documents verified.',
    verified_by: 3,
    verified_at: '2025-06-10 10:00:00',
    approved_by: 1,
    approved_at: '2025-06-11 08:00:00',
    admissionCredentials: JSON.stringify(['f138', 'f137a', 'cert', 'birthCert']),
  },

  // ── 12. College — FIRST-TIME, BSIS ───────────────────────────────────────
  {
    ...personal,
    educationLevel: 'College',
    course: 'BSIS',
    enrollmentType: 'first-time',
    studentStatus: 'regular',
    studentType: 'New',
    studentNumber: 'COL-2025-001',
    curriculumYear: '1st Year',
    status: 'submitted',
    lastHSSchool: 'Eastern Mindoro College',
    lastHSCurriculumYear: 'G12',
    lastHSSection: 'STEM-A',
    lastHSSYStart: '2024',
    lastHSSYEnd: '2025',
    admissionCredentials: JSON.stringify(['f138', 'f137a', 'cert', 'birthCert', 'tor']),
  },

  // ── 13. College — CONTINUING, BSBA, Regular ──────────────────────────────
  {
    ...personal,
    educationLevel: 'College',
    course: 'BSBA',
    major: 'Financial Management',
    enrollmentType: 'continuing',
    studentStatus: 'regular',
    studentType: 'Old',
    studentNumber: 'COL-2025-002',
    curriculumYear: '2nd Year',
    status: 'submitted',
    admissionCredentials: JSON.stringify(['f138', 'f137a', 'cert', 'birthCert']),
  },

  // ── 14. College — CONTINUING, BSBA, Irregular ────────────────────────────
  {
    ...personal,
    educationLevel: 'College',
    course: 'BSBA',
    major: 'Marketing Management',
    enrollmentType: 'continuing',
    studentStatus: 'irregular',
    studentType: 'Old',
    studentNumber: 'COL-2025-003',
    curriculumYear: '3rd Year',
    status: 'submitted',
    admissionCredentials: JSON.stringify(['f138', 'f137a', 'cert', 'birthCert']),
  },

  // ── 15. College — RETURNEE, BEED ─────────────────────────────────────────
  {
    ...personal,
    educationLevel: 'College',
    course: 'BEED',
    enrollmentType: 'returnee',
    studentStatus: 'irregular',
    studentType: 'Old',
    studentNumber: 'COL-2025-004',
    curriculumYear: '2nd Year',
    status: 'submitted',
    admissionCredentials: JSON.stringify(['f138', 'f137a', 'cert', 'birthCert']),
  },

  // ── 16. College — TRANSFEREE, BSED (with TOR) ────────────────────────────
  {
    ...personal,
    educationLevel: 'College',
    course: 'BSED',
    major: 'Mathematics',
    enrollmentType: 'transferee',
    studentStatus: 'irregular',
    studentType: 'New',
    studentNumber: 'COL-2025-005',
    curriculumYear: '2nd Year',
    status: 'submitted',
    torFilePath: '/uploads/tor/tor-sergio-sample.pdf',
    tor_evaluated: 0,
    admissionCredentials: JSON.stringify(['f138', 'f137a', 'cert', 'birthCert', 'tor']),
  },

  // ── 17. College — TRANSFEREE, BSCrim (TOR already evaluated) ─────────────
  {
    ...personal,
    educationLevel: 'College',
    course: 'BSCrim',
    enrollmentType: 'transferee',
    studentStatus: 'irregular',
    studentType: 'New',
    studentNumber: 'COL-2025-006',
    curriculumYear: '2nd Year',
    status: 'verified',
    torFilePath: '/uploads/tor/tor-sergio-sample2.pdf',
    tor_evaluated: 1,
    tor_remarks: 'TOR evaluated. 24 units credited from previous school. Student placed in 2nd year irregular.',
    registrar_remarks: 'TOR evaluated and documents complete.',
    verified_by: 3,
    verified_at: '2025-06-12 11:00:00',
    admissionCredentials: JSON.stringify(['f138', 'f137a', 'cert', 'birthCert', 'tor']),
  },

  // ── 18. College — FIRST-TIME, BSED English, Approved ─────────────────────
  {
    ...personal,
    educationLevel: 'College',
    course: 'BSED',
    major: 'English',
    enrollmentType: 'first-time',
    studentStatus: 'regular',
    studentType: 'New',
    studentNumber: 'COL-2025-007',
    curriculumYear: '1st Year',
    status: 'approved',
    registrar_remarks: 'All documents verified and complete.',
    verified_by: 3,
    verified_at: '2025-06-10 09:00:00',
    approved_by: 1,
    approved_at: '2025-06-11 10:00:00',
    admissionCredentials: JSON.stringify(['f138', 'f137a', 'cert', 'birthCert', 'tor']),
  },

];

// ── Insert all enrollments ────────────────────────────────────────────────────
let count = 0;
for (const e of enrollments) {
  const cols = Object.keys(e);
  const placeholders = cols.map(() => '?').join(', ');
  const values = Object.values(e);

  await sequelize.query(
    `INSERT INTO enrollment_records (${cols.join(', ')}, createdAt, updatedAt)
     VALUES (${placeholders}, datetime('now'), datetime('now'))`,
    { replacements: values }
  );
  count++;
  console.log(`✅ [${count}/${enrollments.length}] ${e.educationLevel} ${e.gradeLevel || e.course || ''} — ${e.enrollmentType || 'N/A'} — status: ${e.status}`);
}

console.log(`\n🎉 Done! Created ${count} enrollments for Sergio Folloso`);
console.log('\nSummary:');
console.log('  JHS: 7 enrollments (SSC qualified, not qualified, passed, failed, pending exam, grade 8, grade 10 verified)');
console.log('  SHS: 4 enrollments (STEM, ABM, HUMSS returned, Grade 12 approved)');
console.log('  College: 7 enrollments (first-time, continuing regular, continuing irregular, returnee, transferee, transferee evaluated, approved)');

await sequelize.close();
