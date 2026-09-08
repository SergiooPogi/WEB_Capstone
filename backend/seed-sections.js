import { sequelize } from './models/db.js';

await sequelize.query('DELETE FROM sections');
console.log('✅ Cleared sections\n');

const sections = [
  // ── JHS ──────────────────────────────────────────────────────────────────
  { code: 'JHS-7-SSC-A',  course: 'JHS', yearLevel: 7,  semester: '1st Semester', schoolYear: '2025-2026', instructor: 'Ms. Ana Reyes',      schedule: 'MWF 7:30-8:30 AM',  room: 'Room 101', capacity: 30, currentEnrollment: 0,  isActive: 1 },
  { code: 'JHS-7-REG-A',  course: 'JHS', yearLevel: 7,  semester: '1st Semester', schoolYear: '2025-2026', instructor: 'Mr. Jose Santos',     schedule: 'MWF 8:30-9:30 AM',  room: 'Room 102', capacity: 40, currentEnrollment: 5,  isActive: 1 },
  { code: 'JHS-7-REG-B',  course: 'JHS', yearLevel: 7,  semester: '1st Semester', schoolYear: '2025-2026', instructor: 'Ms. Liza Cruz',       schedule: 'TTH 7:30-9:00 AM',  room: 'Room 103', capacity: 40, currentEnrollment: 12, isActive: 1 },
  { code: 'JHS-8-A',      course: 'JHS', yearLevel: 8,  semester: '1st Semester', schoolYear: '2025-2026', instructor: 'Mr. Ramon Dela Cruz', schedule: 'MWF 9:30-10:30 AM', room: 'Room 104', capacity: 40, currentEnrollment: 8,  isActive: 1 },
  { code: 'JHS-9-A',      course: 'JHS', yearLevel: 9,  semester: '1st Semester', schoolYear: '2025-2026', instructor: 'Ms. Carla Bautista',  schedule: 'TTH 9:00-10:30 AM', room: 'Room 105', capacity: 40, currentEnrollment: 15, isActive: 1 },
  { code: 'JHS-10-A',     course: 'JHS', yearLevel: 10, semester: '1st Semester', schoolYear: '2025-2026', instructor: 'Mr. Edwin Ramos',     schedule: 'MWF 10:30-11:30 AM',room: 'Room 106', capacity: 40, currentEnrollment: 20, isActive: 1 },

  // ── SHS ──────────────────────────────────────────────────────────────────
  { code: 'SHS-11-STEM-A',  course: 'SHS', yearLevel: 11, semester: '1st Semester', schoolYear: '2025-2026', instructor: 'Ms. Grace Villanueva', schedule: 'MWF 7:30-9:00 AM',  room: 'Room 201', capacity: 35, currentEnrollment: 10, isActive: 1 },
  { code: 'SHS-11-ABM-A',   course: 'SHS', yearLevel: 11, semester: '1st Semester', schoolYear: '2025-2026', instructor: 'Mr. Paolo Mendoza',    schedule: 'TTH 7:30-9:00 AM',  room: 'Room 202', capacity: 35, currentEnrollment: 7,  isActive: 1 },
  { code: 'SHS-11-HUMSS-A', course: 'SHS', yearLevel: 11, semester: '1st Semester', schoolYear: '2025-2026', instructor: 'Ms. Rowena Garcia',    schedule: 'MWF 9:00-10:30 AM', room: 'Room 203', capacity: 35, currentEnrollment: 18, isActive: 1 },
  { code: 'SHS-12-STEM-A',  course: 'SHS', yearLevel: 12, semester: '2nd Semester', schoolYear: '2025-2026', instructor: 'Mr. Dennis Aquino',    schedule: 'TTH 9:00-10:30 AM', room: 'Room 204', capacity: 35, currentEnrollment: 25, isActive: 1 },
  { code: 'SHS-12-ABM-A',   course: 'SHS', yearLevel: 12, semester: '2nd Semester', schoolYear: '2025-2026', instructor: 'Ms. Tina Flores',      schedule: 'MWF 10:30-12:00 PM',room: 'Room 205', capacity: 35, currentEnrollment: 30, isActive: 1 },
  { code: 'SHS-12-HUMSS-A', course: 'SHS', yearLevel: 12, semester: '2nd Semester', schoolYear: '2025-2026', instructor: 'Mr. Arnel Torres',     schedule: 'TTH 10:30-12:00 PM',room: 'Room 206', capacity: 35, currentEnrollment: 22, isActive: 1 },

  // ── College ───────────────────────────────────────────────────────────────
  { code: 'BSIS-1A',  course: 'BSIS',   yearLevel: 1, semester: '1st Semester', schoolYear: '2025-2026', instructor: 'Mr. Carlo Reyes',     schedule: 'MWF 7:30-9:00 AM',  room: 'Room 301', capacity: 40, currentEnrollment: 3,  isActive: 1 },
  { code: 'BSIS-2A',  course: 'BSIS',   yearLevel: 2, semester: '1st Semester', schoolYear: '2025-2026', instructor: 'Ms. Donna Lim',       schedule: 'TTH 7:30-9:00 AM',  room: 'Room 302', capacity: 40, currentEnrollment: 15, isActive: 1 },
  { code: 'BSIS-3A',  course: 'BSIS',   yearLevel: 3, semester: '1st Semester', schoolYear: '2025-2026', instructor: 'Mr. Felix Navarro',   schedule: 'MWF 9:00-10:30 AM', room: 'Room 303', capacity: 40, currentEnrollment: 20, isActive: 1 },
  { code: 'BSBA-1A',  course: 'BSBA',   yearLevel: 1, semester: '1st Semester', schoolYear: '2025-2026', instructor: 'Ms. Helen Castro',    schedule: 'TTH 9:00-10:30 AM', room: 'Room 304', capacity: 40, currentEnrollment: 8,  isActive: 1 },
  { code: 'BSBA-2A',  course: 'BSBA',   yearLevel: 2, semester: '1st Semester', schoolYear: '2025-2026', instructor: 'Mr. Ivan Soriano',    schedule: 'MWF 10:30-12:00 PM',room: 'Room 305', capacity: 40, currentEnrollment: 22, isActive: 1 },
  { code: 'BSBA-3A',  course: 'BSBA',   yearLevel: 3, semester: '1st Semester', schoolYear: '2025-2026', instructor: 'Ms. Jenny Pascual',   schedule: 'TTH 10:30-12:00 PM',room: 'Room 306', capacity: 40, currentEnrollment: 35, isActive: 1 },
  { code: 'BEED-1A',  course: 'BEED',   yearLevel: 1, semester: '1st Semester', schoolYear: '2025-2026', instructor: 'Ms. Karen Salazar',   schedule: 'MWF 1:00-2:30 PM',  room: 'Room 307', capacity: 40, currentEnrollment: 5,  isActive: 1 },
  { code: 'BEED-2A',  course: 'BEED',   yearLevel: 2, semester: '1st Semester', schoolYear: '2025-2026', instructor: 'Mr. Leo Fernandez',   schedule: 'TTH 1:00-2:30 PM',  room: 'Room 308', capacity: 40, currentEnrollment: 18, isActive: 1 },
  { code: 'BSED-1A',  course: 'BSED',   yearLevel: 1, semester: '1st Semester', schoolYear: '2025-2026', instructor: 'Ms. Mia Gonzales',    schedule: 'MWF 2:30-4:00 PM',  room: 'Room 309', capacity: 40, currentEnrollment: 12, isActive: 1 },
  { code: 'BSED-2A',  course: 'BSED',   yearLevel: 2, semester: '1st Semester', schoolYear: '2025-2026', instructor: 'Mr. Noel Aguilar',    schedule: 'TTH 2:30-4:00 PM',  room: 'Room 310', capacity: 40, currentEnrollment: 28, isActive: 1 },
  { code: 'BSCrim-1A',course: 'BSCrim', yearLevel: 1, semester: '1st Semester', schoolYear: '2025-2026', instructor: 'Mr. Oscar Dela Rosa', schedule: 'MWF 4:00-5:30 PM',  room: 'Room 311', capacity: 40, currentEnrollment: 6,  isActive: 1 },
  { code: 'BSCrim-2A',course: 'BSCrim', yearLevel: 2, semester: '1st Semester', schoolYear: '2025-2026', instructor: 'Ms. Petra Villafuerte',schedule: 'TTH 4:00-5:30 PM', room: 'Room 312', capacity: 40, currentEnrollment: 32, isActive: 1 },
];

let count = 0;
for (const s of sections) {
  await sequelize.query(
    `INSERT INTO sections (code, course, yearLevel, semester, schoolYear, instructor, schedule, room, capacity, currentEnrollment, isActive, createdAt, updatedAt)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))`,
    { replacements: [s.code, s.course, s.yearLevel, s.semester, s.schoolYear, s.instructor, s.schedule, s.room, s.capacity, s.currentEnrollment, s.isActive] }
  );
  count++;
  console.log(`✅ [${count}] ${s.code} — ${s.instructor} — ${s.schedule} — ${s.currentEnrollment}/${s.capacity}`);
}

console.log(`\n🎉 Created ${count} sections`);
await sequelize.close();
