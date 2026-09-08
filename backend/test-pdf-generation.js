/*
Test script for PDF generation
*/

import { generateEnrollmentPDF, formatEnrollmentData } from './services/pdfGenerator.js';
import fs from 'fs';

// Sample enrollment data
const sampleEnrollment = {
  id: 1,
  userId: 1,
  studentType: 'New',
  studentNumber: '2024-00001',
  semester: 'First Semester',
  academicYear: '2024-2025',
  dateEnrolled: '2024-08-15',
  course: 'BSIS',
  major: null,
  curriculumYear: '2024',
  admissionCredentials: ['F-138', 'F-137-A', 'Birth Certificate'],
  familyName: 'Dela Cruz',
  firstName: 'Juan',
  middleName: 'Santos',
  sex: 'Male',
  dateOfBirth: '2005-03-20',
  placeOfBirth: 'Calapan City',
  email: 'juan.delacruz@example.com',
  mobileNumber: '09123456789',
  fatherName: 'Pedro Dela Cruz',
  fatherOccupation: 'Farmer',
  fatherAddress: 'Barangay San Antonio, Calapan City',
  motherName: 'Maria Dela Cruz',
  motherOccupation: 'Teacher',
  motherAddress: 'Barangay San Antonio, Calapan City',
  guardianName: '',
  guardianOccupation: '',
  guardianAddress: '',
  educationalBackground: {
    primary: { school: 'Calapan Elementary School', year: '2017' },
    intermediate: { school: '', year: '' },
    juniorHigh: { school: 'Calapan National High School', year: '2021' },
    seniorHigh: { school: 'Calapan National High School', year: '2023' },
    lastCollege: { school: '', year: '' }
  },
  subjects: [
    { code: 'CS101', description: 'Introduction to Computing', units: '3', time: 'MWF', dayTime: '8:00-9:00 AM' },
    { code: 'MATH101', description: 'College Algebra', units: '3', time: 'TTH', dayTime: '10:00-11:30 AM' },
    { code: 'ENG101', description: 'English Communication', units: '3', time: 'MWF', dayTime: '1:00-2:00 PM' }
  ],
  studentSignature: 'Juan Dela Cruz',
  referredBy: 'School Guidance Office',
  status: 'submitted',
  createdAt: new Date(),
  updatedAt: new Date()
};

console.log('Testing PDF generation...');

try {
  const formattedData = formatEnrollmentData(sampleEnrollment);
  const pdfBuffer = await generateEnrollmentPDF(formattedData);
  
  // Save to file
  fs.writeFileSync('test-enrollment.pdf', pdfBuffer);
  
  console.log('✓ PDF generated successfully!');
  console.log('✓ File saved as: test-enrollment.pdf');
  console.log(`✓ File size: ${pdfBuffer.length} bytes`);
} catch (error) {
  console.error('✗ PDF generation failed:', error);
  process.exit(1);
}
