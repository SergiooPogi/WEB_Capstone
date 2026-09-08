/*
    Test Enrollments Seeding Script
    Creates sample enrollment records for testing admin features
    
    MIT License
    Copyright (c) 2025 Christian I. Cabrera || XianFire Framework
    Mindoro State University - Philippines
*/

import { EnrollmentRecord } from "./models/enrollmentRecordModel.js";
import { User } from "./models/userModel.js";
import { sequelize } from "./models/db.js";

await sequelize.sync();

console.log("🌱 Seeding test enrollments...\n");

try {
  // Get the student user
  const student = await User.findOne({ where: { email: "student@emc.edu.ph" } });
  
  if (!student) {
    console.error("❌ Student user not found. Please run seed-test-users.js first.");
    process.exit(1);
  }

  // Create sample enrollments
  const enrollments = [
    {
      userId: student.id,
      educationLevel: 'College',
      enrollmentType: 'first-time',
      studentStatus: 'regular',
      semester: '1st',
      academicYear: '2025-2026',
      dateEnrolled: new Date(),
      course: 'BSED',
      major: 'English',
      curriculumYear: '1st Year',
      familyName: 'Doe',
      firstName: 'John',
      middleName: 'Michael',
      sex: 'Male',
      dateOfBirth: '2005-03-15',
      placeOfBirth: 'Manila',
      email: 'student@emc.edu.ph',
      mobileNumber: '09123456789',
      fatherName: 'James Doe',
      fatherOccupation: 'Engineer',
      fatherAddress: '123 Main St, Manila',
      motherName: 'Mary Doe',
      motherOccupation: 'Teacher',
      motherAddress: '123 Main St, Manila',
      status: 'submitted',
      completion_percentage: 50
    },
    {
      userId: student.id,
      educationLevel: 'College',
      enrollmentType: 'first-time',
      studentStatus: 'regular',
      semester: '1st',
      academicYear: '2025-2026',
      dateEnrolled: new Date(),
      course: 'BSIS',
      major: null,
      curriculumYear: '1st Year',
      familyName: 'Smith',
      firstName: 'Jane',
      middleName: 'Anne',
      sex: 'Female',
      dateOfBirth: '2005-06-20',
      placeOfBirth: 'Cebu',
      email: 'jane.smith@example.com',
      mobileNumber: '09987654321',
      fatherName: 'Robert Smith',
      fatherOccupation: 'Businessman',
      fatherAddress: '456 Oak Ave, Cebu',
      motherName: 'Patricia Smith',
      motherOccupation: 'Nurse',
      motherAddress: '456 Oak Ave, Cebu',
      status: 'draft',
      completion_percentage: 25
    },
    {
      userId: student.id,
      educationLevel: 'College',
      enrollmentType: 'continuing',
      studentStatus: 'regular',
      semester: '2nd',
      academicYear: '2025-2026',
      dateEnrolled: new Date(),
      course: 'BSBA',
      major: 'Financial Management',
      curriculumYear: '2nd Year',
      familyName: 'Johnson',
      firstName: 'Michael',
      middleName: 'David',
      sex: 'Male',
      dateOfBirth: '2004-09-10',
      placeOfBirth: 'Davao',
      email: 'michael.johnson@example.com',
      mobileNumber: '09555666777',
      fatherName: 'William Johnson',
      fatherOccupation: 'Manager',
      fatherAddress: '789 Pine Rd, Davao',
      motherName: 'Elizabeth Johnson',
      motherOccupation: 'Accountant',
      motherAddress: '789 Pine Rd, Davao',
      status: 'approved',
      completion_percentage: 75
    }
  ];

  for (const enrollment of enrollments) {
    await EnrollmentRecord.create(enrollment);
  }

  console.log(`✅ ${enrollments.length} test enrollments created`);
  console.log("\n📋 ENROLLMENT STATUSES:");
  console.log("   - 1 Draft (25% complete)");
  console.log("   - 1 Submitted (50% complete)");
  console.log("   - 1 Approved (75% complete)");
  console.log("\n🎉 Enrollment seeding completed!");
  process.exit(0);
} catch (error) {
  console.error("❌ Error seeding enrollments:", error.message);
  process.exit(1);
}
