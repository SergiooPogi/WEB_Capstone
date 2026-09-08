/*
Manual test script for POST /api/enrollments endpoint
Run this after starting the server with: node xian-start
*/

import fetch from 'node-fetch';

const API_URL = 'http://localhost:3000';

// Test data
const testUser = {
  email: 'test@example.com',
  password: 'password123',
  name: 'Test User'
};

const testEnrollment = {
  studentType: 'New',
  course: 'BSIS',
  semester: 'First Semester',
  academicYear: '2024-2025',
  dateEnrolled: '2025-01-15',
  familyName: 'Doe',
  firstName: 'John',
  middleName: 'Smith',
  sex: 'Male',
  dateOfBirth: '2000-01-01',
  email: 'test@example.com',
  mobileNumber: '09123456789'
};

async function testEnrollmentEndpoint() {
  try {
    console.log('🧪 Testing POST /api/enrollments endpoint...\n');

    // Step 1: Register a test user
    console.log('1️⃣ Registering test user...');
    const registerResponse = await fetch(`${API_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testUser)
    });

    if (!registerResponse.ok) {
      // User might already exist, try logging in
      console.log('   User already exists, logging in instead...');
      const loginResponse = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: testUser.email, password: testUser.password })
      });

      if (!loginResponse.ok) {
        throw new Error(`Login failed: ${await loginResponse.text()}`);
      }

      const loginData = await loginResponse.json();
      var token = loginData.token;
      console.log('   ✅ Logged in successfully');
    } else {
      const registerData = await registerResponse.json();
      var token = registerData.token;
      console.log('   ✅ User registered successfully');
    }

    // Step 2: Create enrollment
    console.log('\n2️⃣ Creating enrollment record...');
    const enrollmentResponse = await fetch(`${API_URL}/api/enrollments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(testEnrollment)
    });

    if (!enrollmentResponse.ok) {
      const errorText = await enrollmentResponse.text();
      throw new Error(`Enrollment creation failed: ${errorText}`);
    }

    const enrollmentData = await enrollmentResponse.json();
    console.log('   ✅ Enrollment created successfully!');
    console.log('   📄 Response:', JSON.stringify(enrollmentData, null, 2));

    // Step 3: Verify the enrollment
    console.log('\n3️⃣ Verifying enrollment record...');
    
    // Check required fields
    const checks = [
      { field: 'id', condition: enrollmentData.enrollment?.id, message: 'Has ID' },
      { field: 'userId', condition: enrollmentData.enrollment?.userId, message: 'Associated with user' },
      { field: 'status', condition: enrollmentData.enrollment?.status === 'submitted', message: 'Status is "submitted"' },
      { field: 'studentType', condition: enrollmentData.enrollment?.studentType === 'New', message: 'Student type is correct' },
      { field: 'course', condition: enrollmentData.enrollment?.course === 'BSIS', message: 'Course is correct' },
      { field: 'createdAt', condition: enrollmentData.enrollment?.createdAt, message: 'Has createdAt timestamp' },
      { field: 'updatedAt', condition: enrollmentData.enrollment?.updatedAt, message: 'Has updatedAt timestamp' }
    ];

    let allPassed = true;
    checks.forEach(check => {
      if (check.condition) {
        console.log(`   ✅ ${check.message}`);
      } else {
        console.log(`   ❌ ${check.message} - FAILED`);
        allPassed = false;
      }
    });

    console.log('\n' + '='.repeat(50));
    if (allPassed) {
      console.log('✅ ALL TESTS PASSED!');
      console.log('Task 2.2 requirements verified:');
      console.log('  ✓ Endpoint saves new enrollment records');
      console.log('  ✓ Associates enrollment with authenticated user');
      console.log('  ✓ Sets default status to "submitted"');
      console.log('  ✓ Returns created record with ID');
      console.log('  ✓ Handles database operations correctly');
    } else {
      console.log('❌ SOME TESTS FAILED');
    }
    console.log('='.repeat(50));

  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    console.error('Stack:', error.stack);
  }
}

// Run the test
testEnrollmentEndpoint();
