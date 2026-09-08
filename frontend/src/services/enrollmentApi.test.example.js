/**
 * Example Test File for Enrollment API Service
 * 
 * This file demonstrates how to test the enrollment API service functions.
 * To run these tests, you'll need to:
 * 1. Have the backend server running on http://localhost:3000
 * 2. Have a valid JWT token stored in localStorage
 * 3. Open the browser console and run these functions manually
 * 
 * Note: This is not an automated test suite. It's a manual testing guide.
 */

import {
  createEnrollment,
  getEnrollments,
  getEnrollmentById,
  getUserEnrollments,
  updateEnrollment,
  updateEnrollmentStatus,
  downloadEnrollmentPDF,
  deleteEnrollment
} from './enrollmentApi.js';

/**
 * Test data for creating an enrollment
 */
const sampleEnrollmentData = {
  studentType: 'New',
  studentNumber: '2024-001',
  semester: '1st Semester',
  academicYear: '2024-2025',
  dateEnrolled: '2024-01-15',
  course: 'BSIS',
  major: '',
  curriculumYear: '2024',
  admissionCredentials: ['F-138', 'Birth Certificate'],
  familyName: 'Doe',
  firstName: 'John',
  middleName: 'Smith',
  sex: 'Male',
  dateOfBirth: '2000-05-15',
  placeOfBirth: 'Manila',
  email: 'john.doe@example.com',
  mobileNumber: '09123456789',
  fatherName: 'Robert Doe',
  fatherOccupation: 'Engineer',
  fatherAddress: '123 Main St, Manila',
  motherName: 'Jane Doe',
  motherOccupation: 'Teacher',
  motherAddress: '123 Main St, Manila',
  guardianName: '',
  guardianOccupation: '',
  guardianAddress: '',
  educationalBackground: {
    primary: { school: 'Manila Elementary School', year: '2012' },
    intermediate: { school: '', year: '' },
    juniorHigh: { school: 'Manila High School', year: '2016' },
    seniorHigh: { school: 'Manila Senior High', year: '2018' },
    lastCollege: { school: '', year: '' }
  },
  subjects: [
    {
      code: 'CS101',
      description: 'Introduction to Programming',
      units: '3',
      time: 'MWF',
      dayTime: '8:00-9:00 AM'
    },
    {
      code: 'MATH101',
      description: 'College Algebra',
      units: '3',
      time: 'TTH',
      dayTime: '10:00-11:30 AM'
    }
  ],
  studentSignature: 'John Doe',
  referredBy: 'School Website'
};

/**
 * Test 1: Create a new enrollment
 */
export async function testCreateEnrollment() {
  console.log('Test 1: Creating new enrollment...');
  try {
    const result = await createEnrollment(sampleEnrollmentData);
    console.log('✓ Enrollment created successfully:', result);
    return result.enrollment.id;
  } catch (error) {
    console.error('✗ Failed to create enrollment:', error.message);
    throw error;
  }
}

/**
 * Test 2: Get all enrollments (admin only)
 */
export async function testGetEnrollments() {
  console.log('Test 2: Fetching all enrollments...');
  try {
    const result = await getEnrollments({ page: 1, limit: 10 });
    console.log('✓ Enrollments fetched successfully:', result);
    return result.enrollments;
  } catch (error) {
    console.error('✗ Failed to fetch enrollments:', error.message);
    throw error;
  }
}

/**
 * Test 3: Get enrollment by ID
 */
export async function testGetEnrollmentById(enrollmentId) {
  console.log(`Test 3: Fetching enrollment ${enrollmentId}...`);
  try {
    const enrollment = await getEnrollmentById(enrollmentId);
    console.log('✓ Enrollment fetched successfully:', enrollment);
    return enrollment;
  } catch (error) {
    console.error('✗ Failed to fetch enrollment:', error.message);
    throw error;
  }
}

/**
 * Test 4: Get user enrollments
 */
export async function testGetUserEnrollments(userId) {
  console.log(`Test 4: Fetching enrollments for user ${userId}...`);
  try {
    const enrollments = await getUserEnrollments(userId);
    console.log('✓ User enrollments fetched successfully:', enrollments);
    return enrollments;
  } catch (error) {
    console.error('✗ Failed to fetch user enrollments:', error.message);
    throw error;
  }
}

/**
 * Test 5: Update enrollment
 */
export async function testUpdateEnrollment(enrollmentId) {
  console.log(`Test 5: Updating enrollment ${enrollmentId}...`);
  try {
    const updateData = {
      semester: '2nd Semester',
      academicYear: '2024-2025'
    };
    const result = await updateEnrollment(enrollmentId, updateData);
    console.log('✓ Enrollment updated successfully:', result);
    return result.enrollment;
  } catch (error) {
    console.error('✗ Failed to update enrollment:', error.message);
    throw error;
  }
}

/**
 * Test 6: Update enrollment status (admin only)
 */
export async function testUpdateEnrollmentStatus(enrollmentId, status = 'approved') {
  console.log(`Test 6: Updating enrollment status to ${status}...`);
  try {
    const result = await updateEnrollmentStatus(enrollmentId, status);
    console.log('✓ Status updated successfully:', result);
    return result.enrollment;
  } catch (error) {
    console.error('✗ Failed to update status:', error.message);
    throw error;
  }
}

/**
 * Test 7: Download enrollment PDF
 */
export async function testDownloadEnrollmentPDF(enrollmentId) {
  console.log(`Test 7: Downloading PDF for enrollment ${enrollmentId}...`);
  try {
    await downloadEnrollmentPDF(enrollmentId);
    console.log('✓ PDF download initiated successfully');
  } catch (error) {
    console.error('✗ Failed to download PDF:', error.message);
    throw error;
  }
}

/**
 * Test 8: Filter enrollments by status (admin only)
 */
export async function testFilterEnrollmentsByStatus(status = 'submitted') {
  console.log(`Test 8: Filtering enrollments by status: ${status}...`);
  try {
    const result = await getEnrollments({ status, page: 1, limit: 10 });
    console.log('✓ Filtered enrollments fetched successfully:', result);
    return result.enrollments;
  } catch (error) {
    console.error('✗ Failed to filter enrollments:', error.message);
    throw error;
  }
}

/**
 * Test 9: Search enrollments by name (admin only)
 */
export async function testSearchEnrollmentsByName(searchQuery = 'John') {
  console.log(`Test 9: Searching enrollments by name: ${searchQuery}...`);
  try {
    const result = await getEnrollments({ search: searchQuery, page: 1, limit: 10 });
    console.log('✓ Search results fetched successfully:', result);
    return result.enrollments;
  } catch (error) {
    console.error('✗ Failed to search enrollments:', error.message);
    throw error;
  }
}

/**
 * Test 10: Delete enrollment
 */
export async function testDeleteEnrollment(enrollmentId) {
  console.log(`Test 10: Deleting enrollment ${enrollmentId}...`);
  try {
    const result = await deleteEnrollment(enrollmentId);
    console.log('✓ Enrollment deleted successfully:', result);
  } catch (error) {
    console.error('✗ Failed to delete enrollment:', error.message);
    throw error;
  }
}

/**
 * Run all tests in sequence
 * 
 * Usage in browser console:
 * 1. Make sure you're logged in and have a token in localStorage
 * 2. Import this file in your component or run in console
 * 3. Call runAllTests()
 */
export async function runAllTests() {
  console.log('=== Starting Enrollment API Tests ===\n');
  
  try {
    // Test 1: Create enrollment
    const enrollmentId = await testCreateEnrollment();
    console.log('\n');
    
    // Test 2: Get all enrollments (admin only)
    await testGetEnrollments();
    console.log('\n');
    
    // Test 3: Get enrollment by ID
    await testGetEnrollmentById(enrollmentId);
    console.log('\n');
    
    // Test 4: Get user enrollments (use your user ID)
    const userId = 1; // Replace with actual user ID
    await testGetUserEnrollments(userId);
    console.log('\n');
    
    // Test 5: Update enrollment
    await testUpdateEnrollment(enrollmentId);
    console.log('\n');
    
    // Test 6: Update enrollment status (admin only)
    await testUpdateEnrollmentStatus(enrollmentId, 'approved');
    console.log('\n');
    
    // Test 7: Download PDF
    await testDownloadEnrollmentPDF(enrollmentId);
    console.log('\n');
    
    // Test 8: Filter by status (admin only)
    await testFilterEnrollmentsByStatus('approved');
    console.log('\n');
    
    // Test 9: Search by name (admin only)
    await testSearchEnrollmentsByName('John');
    console.log('\n');
    
    // Test 10: Delete enrollment (optional - uncomment to test)
    // await testDeleteEnrollment(enrollmentId);
    // console.log('\n');
    
    console.log('=== All Tests Completed Successfully ===');
  } catch (error) {
    console.error('=== Test Suite Failed ===');
    console.error('Error:', error);
  }
}

/**
 * Quick test for student users (non-admin)
 */
export async function runStudentTests() {
  console.log('=== Starting Student API Tests ===\n');
  
  try {
    // Create enrollment
    const enrollmentId = await testCreateEnrollment();
    console.log('\n');
    
    // Get own enrollments
    const userId = 1; // Replace with actual user ID
    await testGetUserEnrollments(userId);
    console.log('\n');
    
    // Get enrollment by ID
    await testGetEnrollmentById(enrollmentId);
    console.log('\n');
    
    // Update enrollment
    await testUpdateEnrollment(enrollmentId);
    console.log('\n');
    
    // Download PDF
    await testDownloadEnrollmentPDF(enrollmentId);
    console.log('\n');
    
    console.log('=== Student Tests Completed Successfully ===');
  } catch (error) {
    console.error('=== Student Test Suite Failed ===');
    console.error('Error:', error);
  }
}

/**
 * Quick test for admin users
 */
export async function runAdminTests() {
  console.log('=== Starting Admin API Tests ===\n');
  
  try {
    // Get all enrollments
    await testGetEnrollments();
    console.log('\n');
    
    // Filter by status
    await testFilterEnrollmentsByStatus('submitted');
    console.log('\n');
    
    // Search by name
    await testSearchEnrollmentsByName('John');
    console.log('\n');
    
    // Update status (use an existing enrollment ID)
    const enrollmentId = 1; // Replace with actual enrollment ID
    await testUpdateEnrollmentStatus(enrollmentId, 'approved');
    console.log('\n');
    
    console.log('=== Admin Tests Completed Successfully ===');
  } catch (error) {
    console.error('=== Admin Test Suite Failed ===');
    console.error('Error:', error);
  }
}

// Export individual test functions for manual testing
export default {
  testCreateEnrollment,
  testGetEnrollments,
  testGetEnrollmentById,
  testGetUserEnrollments,
  testUpdateEnrollment,
  testUpdateEnrollmentStatus,
  testDownloadEnrollmentPDF,
  testFilterEnrollmentsByStatus,
  testSearchEnrollmentsByName,
  testDeleteEnrollment,
  runAllTests,
  runStudentTests,
  runAdminTests
};
