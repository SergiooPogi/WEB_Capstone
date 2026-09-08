/**
 * Seed script: Create 25 demo students with varied enrollments
 * Run: node seed-students.js
 * 
 * Creates user accounts + enrollment records across:
 * - JHS (Grade 7–10), SHS (STEM, ABM, HUMSS), College (all courses)
 * - Statuses: enrolled, submitted, pending_exam, returned, rejected
 * - Types: first-time, continuing, returnee, transferee
 */
import bcrypt from 'bcrypt';
import { sequelize } from './models/db.js';

const DEFAULT_PASSWORD = await bcrypt.hash('Student@2025', 10);

const students = [
  // ── JHS ──────────────────────────────────────────────────────────────────
  { name: 'Juan Dela Cruz',      email: 'juan.delacruz@student.emc.edu.ph',    grade: '7',  level: 'JHS', type: 'New',  status: 'enrolled',      lrn: '100000000001' },
  { name: 'Maria Santos',        email: 'maria.santos@student.emc.edu.ph',     grade: '8',  level: 'JHS', type: 'Old',  status: 'enrolled',      lrn: '100000000002' },
  { name: 'Pedro Reyes',         email: 'pedro.reyes@student.emc.edu.ph',      grade: '9',  level: 'JHS', type: 'Old',  status: 'submitted',     lrn: '100000000003' },
  { name: 'Ana Gonzales',        email: 'ana.gonzales@student.emc.edu.ph',     grade: '10', level: 'JHS', type: 'Old',  status: 'enrolled',      lrn: '100000000004' },
  { name: 'Carlo Mendoza',       email: 'carlo.mendoza@student.emc.edu.ph',    grade: '7',  level: 'JHS', type: 'New',  status: 'pending_exam',  lrn: '100000000005', sscApplied: true },

  // ── SHS ──────────────────────────────────────────────────────────────────
  { name: 'Liza Ramos',          email: 'liza.ramos@student.emc.edu.ph',       grade: '11', level: 'SHS', strand: 'STEM',  type: 'New',  status: 'enrolled',  lrn: '100000000006' },
  { name: 'Mark Villanueva',     email: 'mark.villanueva@student.emc.edu.ph',  grade: '12', level: 'SHS', strand: 'STEM',  type: 'Old',  status: 'enrolled',  lrn: '100000000007' },
  { name: 'Grace Torres',        email: 'grace.torres@student.emc.edu.ph',     grade: '11', level: 'SHS', strand: 'ABM',   type: 'New',  status: 'submitted', lrn: '100000000008' },
  { name: 'Ryan Flores',         email: 'ryan.flores@student.emc.edu.ph',      grade: '12', level: 'SHS', strand: 'ABM',   type: 'Old',  status: 'enrolled',  lrn: '100000000009' },
  { name: 'Jasmine Cruz',        email: 'jasmine.cruz@student.emc.edu.ph',     grade: '11', level: 'SHS', strand: 'HUMSS', type: 'New',  status: 'enrolled',  lrn: '100000000010' },
  { name: 'Kevin Bautista',      email: 'kevin.bautista@student.emc.edu.ph',   grade: '12', level: 'SHS', strand: 'HUMSS', type: 'Old',  status: 'returned',  lrn: '100000000011' },

  // ── College ───────────────────────────────────────────────────────────────
  { name: 'Sofia Aquino',        email: 'sofia.aquino@student.emc.edu.ph',     level: 'College', course: 'BSBA', major: 'Financial Management',  enrollType: 'first-time',  status: 'enrolled',  lrn: '100000000012' },
  { name: 'Miguel Castillo',     email: 'miguel.castillo@student.emc.edu.ph',  level: 'College', course: 'BSBA', major: 'Marketing Management',   enrollType: 'continuing',  status: 'enrolled',  lrn: '100000000013' },
  { name: 'Camille Navarro',     email: 'camille.navarro@student.emc.edu.ph',  level: 'College', course: 'BSIS',                                  enrollType: 'first-time',  status: 'enrolled',  lrn: '100000000014' },
  { name: 'Daniel Lim',          email: 'daniel.lim@student.emc.edu.ph',       level: 'College', course: 'BSIS',                                  enrollType: 'continuing',  status: 'submitted', lrn: '100000000015' },
  { name: 'Patricia Ong',        email: 'patricia.ong@student.emc.edu.ph',     level: 'College', course: 'BEED',                                  enrollType: 'first-time',  status: 'enrolled',  lrn: '100000000016' },
  { name: 'Joshua Tan',          email: 'joshua.tan@student.emc.edu.ph',       level: 'College', course: 'BEED',                                  enrollType: 'returnee',    status: 'enrolled',  lrn: '100000000017' },
  { name: 'Angelica Sy',         email: 'angelica.sy@student.emc.edu.ph',      level: 'College', course: 'BSED', major: 'Mathematics',            enrollType: 'first-time',  status: 'enrolled',  lrn: '100000000018' },
  { name: 'Francis Go',          email: 'francis.go@student.emc.edu.ph',       level: 'College', course: 'BSED', major: 'English',                enrollType: 'continuing',  status: 'submitted', lrn: '100000000019' },
  { name: 'Kristine Yap',        email: 'kristine.yap@student.emc.edu.ph',     level: 'College', course: 'BSCrim',                                enrollType: 'first-time',  status: 'enrolled',  lrn: '100000000020' },
  { name: 'Rodel Pascual',       email: 'rodel.pascual@student.emc.edu.ph',    level: 'College', course: 'BSCrim',                                enrollType: 'transferee',  status: 'enrolled',  lrn: '100000000021' },
  { name: 'Maricel Domingo',     email: 'maricel.domingo@student.emc.edu.ph',  level: 'College', course: 'BSBA', major: 'Financial Management',   enrollType: 'first-time',  status: 'rejected',  lrn: '100000000022' },
  { name: 'Aldrin Soriano',      email: 'aldrin.soriano@student.emc.edu.ph',   level: 'College', course: 'BSIS',                                  enrollType: 'continuing',  status: 'enrolled',  lrn: '100000000023' },
  { name: 'Rhea Magno',          email: 'rhea.magno@student.emc.edu.ph',       level: 'College', course: 'BEED',                                  enrollType: 'first-time',  status: 'submitted', lrn: '100000000024' },
  { name: 'Jomar Ilagan',        email: 'jomar.ilagan@student.emc.edu.ph',     level: 'College', course: 'BSCrim',                                enrollType: 'continuing',  status: 'enrolled',  lrn: '100000000025' },
];

console.log('🌱 Seeding 25 demo students...\n');

let created = 0;
let skipped = 0;

for (let i = 0; i < students.length; i++) {
  const s = students[i];
  const [firstName, ...rest] = s.name.split(' ');
  const familyName = rest.pop() || '';
  const middleName = rest.join(' ') || '';

  try {
    // Create user account (skip if email already exists)
    const [[existing]] = await sequelize.query(
      'SELECT id FROM users WHERE email = ?',
      { replacements: [s.email] }
    );

    let userId;
    if (existing) {
      userId = existing.id;
      skipped++;
    } else {
      await sequelize.query(
        `INSERT INTO users (name, email, password, role, isVerified, createdAt, updatedAt)
         VALUES (?, ?, ?, 'student', 1, datetime('now'), datetime('now'))`,
        { replacements: [s.name, s.email, DEFAULT_PASSWORD] }
      );
      const [[newUser]] = await sequelize.query(
        'SELECT id FROM users WHERE email = ?',
        { replacements: [s.email] }
      );
      userId = newUser.id;
      created++;
    }

    // Check if enrollment already exists for this user
    const [[existingEnroll]] = await sequelize.query(
      'SELECT id FROM enrollment_records WHERE userId = ? LIMIT 1',
      { replacements: [userId] }
    );
    if (existingEnroll) continue;

    // Build enrollment record
    const isCollege = s.level === 'College';
    const isHS = s.level === 'JHS' || s.level === 'SHS';

    const enrollData = {
      userId,
      educationLevel: s.level,
      status: s.status,
      studentType: s.type || 'New',
      enrollmentType: s.enrollType || (isCollege ? 'first-time' : null),
      academicYear: '2025-2026',
      dateEnrolled: '2025-06-10',
      admissionCredentials: JSON.stringify(['f138', 'f137a', 'cert']),
      // Personal info
      firstName,
      familyName,
      middleName,
      sex: i % 2 === 0 ? 'Male' : 'Female',
      dateOfBirth: `200${(i % 8) + 1}-0${(i % 9) + 1}-${10 + (i % 20)}`,
      placeOfBirth: 'Calapan City, Oriental Mindoro',
      email: s.email,
      mobileNumber: `0917${String(10000000 + i).slice(1)}`,
      fatherName: `Roberto ${familyName}`,
      fatherOccupation: ['Engineer', 'Teacher', 'Farmer', 'Driver', 'Nurse'][i % 5],
      motherName: `Maria ${familyName}`,
      motherOccupation: ['Teacher', 'Nurse', 'Vendor', 'Housewife', 'Accountant'][i % 5],
      parentsAddress: `Brgy. ${['Mahal Na Pangalan', 'Sta. Isabel', 'Camilmil', 'Guinobatan', 'Tawiran'][i % 5]}, Calapan City`,
      // HS-specific
      gradeLevel: s.grade ? `Grade ${s.grade}` : null,
      strand: s.strand || null,
      lrn: s.lrn,
      sscApplied: s.sscApplied ? 1 : 0,
      grade6School: isHS ? 'Calapan City Central School' : null,
      grade6Average: isHS ? String(80 + (i % 15)) : null,
      // College-specific
      course: s.course || null,
      major: s.major || null,
      semester: isCollege ? '1st Semester' : null,
      studentNumber: isCollege ? `${s.course || 'COL'}-2025-${String(i + 1).padStart(3, '0')}` : `${s.level}-2025-${String(i + 1).padStart(3, '0')}`,
      // Remarks for returned/rejected
      registrar_remarks: s.status === 'returned' ? 'Please resubmit a clearer copy of your F-138.' : null,
      admin_comments: s.status === 'rejected' ? 'Incomplete requirements. Please complete all required documents.' : null,
    };

    const cols = Object.keys(enrollData).join(', ');
    const placeholders = Object.keys(enrollData).map(() => '?').join(', ');
    const vals = Object.values(enrollData);

    await sequelize.query(
      `INSERT INTO enrollment_records (${cols}, createdAt, updatedAt)
       VALUES (${placeholders}, datetime('now', '-${i} days'), datetime('now', '-${i} days'))`,
      { replacements: vals }
    );

    console.log(`  ✅ ${s.name} — ${s.level}${s.grade ? ` Grade ${s.grade}` : ''}${s.course ? ` ${s.course}` : ''}${s.strand ? ` (${s.strand})` : ''} [${s.status}]`);

  } catch (err) {
    console.error(`  ❌ Failed for ${s.name}: ${err.message}`);
  }
}

console.log(`\n✅ Done! Created ${created} new users, ${skipped} already existed.`);
console.log('📧 All student passwords: Student@2025');
process.exit(0);
