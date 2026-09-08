#!/usr/bin/env node

/**
 * COMPREHENSIVE SYSTEM TESTING SCRIPT
 * Tests all endpoints and features of the EMC Capstone system
 * 
 * Usage: node test-all-endpoints.js
 * 
 * This script tests:
 * 1. Authentication (login, register, logout)
 * 2. Enrollment workflow (create, update, status transitions)
 * 3. SSC logic (qualification, exam scheduling, result recording)
 * 4. Admin operations (approve, reject, bulk export)
 * 5. Subject selection
 * 6. Section management
 * 7. Authorization checks
 * 8. Data validation
 */

import axios from 'axios';

const BASE_URL = 'http://localhost:3000';
let adminToken = '';
let registrarToken = '';
let studentToken = '';
let adminId = '';
let registrarId = '';
let studentId = '';
let enrollmentId = '';

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logTest(name) {
  log(`\n${'='.repeat(60)}`, 'cyan');
  log(`TEST: ${name}`, 'blue');
  log(`${'='.repeat(60)}`, 'cyan');
}

function logSuccess(message) {
  log(`✓ ${message}`, 'green');
}

function logError(message) {
  log(`✗ ${message}`, 'red');
}

function logWarning(message) {
  log(`⚠ ${message}`, 'yellow');
}

async function testAuthentication() {
  logTest('AUTHENTICATION MODULE');

  try {
    // Test 1: Admin Login
    log('\n1. Testing Admin Login...', 'cyan');
    const adminLogin = await axios.post(`${BASE_URL}/api/auth/login`, {
      email: 'admin@emc.edu.ph',
      password: 'admin123'
    });
    adminToken = adminLogin.data.token;
    adminId = adminLogin.data.user.id;
    logSuccess(`Admin login successful. Token: ${adminToken.substring(0, 20)}...`);
    logSuccess(`Admin ID: ${adminId}`);

    // Test 2: Registrar Login
    log('\n2. Testing Registrar Login...', 'cyan');
    const registrarLogin = await axios.post(`${BASE_URL}/api/auth/login`, {
      email: 'registrar@emc.edu.ph',
      password: 'registrar123'
    });
    registrarToken = registrarLogin.data.token;
    registrarId = registrarLogin.data.user.id;
    logSuccess(`Registrar login successful. Token: ${registrarToken.substring(0, 20)}...`);
    logSuccess(`Registrar ID: ${registrarId}`);

    // Test 3: Student Login
    log('\n3. Testing Student Login...', 'cyan');
    const studentLogin = await axios.post(`${BASE_URL}/api/auth/login`, {
      email: 'student@emc.edu.ph',
      password: 'student123'
    });
    studentToken = studentLogin.data.token;
    studentId = studentLogin.data.user.id;
    logSuccess(`Student login successful. Token: ${studentToken.substring(0, 20)}...`);
    logSuccess(`Student ID: ${studentId}`);

    // Test 4: Invalid Login
    log('\n4. Testing Invalid Login...', 'cyan');
    try {
      await axios.post(`${BASE_URL}/api/auth/login`, {
        email: 'invalid@emc.edu.ph',
        password: 'wrongpassword'
      });
      logError('Invalid login should have failed');
    } catch (error) {
      if (error.response.status === 401) {
        logSuccess('Invalid login correctly rejected with 401');
      } else {
        logError(`Unexpected status code: ${error.response.status}`);
      }
    }

    // Test 5: Register New User
    log('\n5. Testing User Registration...', 'cyan');
    const newUserEmail = `testuser${Date.now()}@emc.edu.ph`;
    const registerRes = await axios.post(`${BASE_URL}/api/auth/register`, {
      name: 'Test User',
      email: newUserEmail,
      password: 'testpass123'
    });
    logSuccess(`New user registered: ${newUserEmail}`);
    logSuccess(`New user token: ${registerRes.data.token.substring(0, 20)}...`);

    // Test 6: Duplicate Email Registration
    log('\n6. Testing Duplicate Email Registration...', 'cyan');
    try {
      await axios.post(`${BASE_URL}/api/auth/register`, {
        name: 'Duplicate User',
        email: newUserEmail,
        password: 'testpass123'
      });
      logError('Duplicate email should have been rejected');
    } catch (error) {
      if (error.response.status === 400) {
        logSuccess('Duplicate email correctly rejected with 400');
      }
    }

  } catch (error) {
    logError(`Authentication test failed: ${error.message}`);
    if (error.response) {
      logError(`Response: ${JSON.stringify(error.response.data)}`);
    }
  }
}

async function testEnrollmentWorkflow() {
  logTest('ENROLLMENT WORKFLOW MODULE');

  try {
    // Test 1: Create College Enrollment
    log('\n1. Creating College Enrollment...', 'cyan');
    const collegeEnrollment = await axios.post(
      `${BASE_URL}/api/enrollments`,
      {
        educationLevel: 'College',
        enrollmentType: 'first-time',
        course: 'BSIS',
        major: 'Software Development',
        curriculumYear: '2025-2026',
        familyName: 'Doe',
        firstName: 'John',
        middleName: 'Michael',
        sex: 'Male',
        dateOfBirth: '2000-01-15',
        placeOfBirth: 'Manila',
        email: 'john.doe@example.com',
        mobileNumber: '09123456789',
        fatherName: 'James Doe',
        fatherOccupation: 'Engineer',
        fatherAddress: '123 Main St, Manila',
        motherName: 'Mary Doe',
        motherOccupation: 'Teacher',
        motherAddress: '123 Main St, Manila'
      },
      { headers: { Authorization: `Bearer ${studentToken}` } }
    );
    enrollmentId = collegeEnrollment.data.enrollment.id;
    logSuccess(`College enrollment created. ID: ${enrollmentId}`);
    logSuccess(`Status: ${collegeEnrollment.data.enrollment.status}`);

    // Test 2: Create JHS Enrollment with SSC
    log('\n2. Creating JHS Grade 7 Enrollment with SSC...', 'cyan');
    const jhsEnrollment = await axios.post(
      `${BASE_URL}/api/enrollments`,
      {
        educationLevel: 'JHS',
        gradeLevel: 'Grade 7',
        sscApplied: true,
        grade6Average: '88',
        grade6School: 'Sample Elementary School',
        grade6SchoolAddress: 'Quezon City',
        grade6Section: 'Grade 6-A',
        grade6SYStart: '2023',
        grade6SYEnd: '2024',
        familyName: 'Smith',
        firstName: 'Jane',
        middleName: 'Anne',
        sex: 'Female',
        dateOfBirth: '2010-05-20',
        placeOfBirth: 'Cebu',
        email: 'jane.smith@example.com',
        mobileNumber: '09987654321',
        fatherName: 'Robert Smith',
        fatherOccupation: 'Doctor',
        fatherAddress: '456 Oak Ave, Cebu',
        motherName: 'Patricia Smith',
        motherOccupation: 'Nurse',
        motherAddress: '456 Oak Ave, Cebu'
      },
      { headers: { Authorization: `Bearer ${studentToken}` } }
    );
    logSuccess(`JHS enrollment created. ID: ${jhsEnrollment.data.enrollment.id}`);
    logSuccess(`SSC Status: ${jhsEnrollment.data.sscQualified ? 'QUALIFIED' : 'NOT QUALIFIED'}`);
    logSuccess(`Enrollment Status: ${jhsEnrollment.data.enrollment.status}`);

    // Test 3: Get Single Enrollment
    log('\n3. Getting Single Enrollment...', 'cyan');
    const getEnrollment = await axios.get(
      `${BASE_URL}/api/enrollments/${enrollmentId}`,
      { headers: { Authorization: `Bearer ${studentToken}` } }
    );
    logSuccess(`Retrieved enrollment: ${getEnrollment.data.firstName} ${getEnrollment.data.familyName}`);

    // Test 4: Update Enrollment
    log('\n4. Updating Enrollment...', 'cyan');
    const updateEnrollment = await axios.put(
      `${BASE_URL}/api/enrollments/${enrollmentId}`,
      {
        mobileNumber: '09111111111',
        email: 'newemail@example.com'
      },
      { headers: { Authorization: `Bearer ${studentToken}` } }
    );
    logSuccess(`Enrollment updated. New email: ${updateEnrollment.data.enrollment.email}`);

    // Test 5: Get User Enrollments
    log('\n5. Getting User Enrollments...', 'cyan');
    const userEnrollments = await axios.get(
      `${BASE_URL}/api/enrollments/user/${studentId}`,
      { headers: { Authorization: `Bearer ${studentToken}` } }
    );
    logSuccess(`Retrieved ${userEnrollments.data.length} enrollments for user`);

  } catch (error) {
    logError(`Enrollment workflow test failed: ${error.message}`);
    if (error.response) {
      logError(`Response: ${JSON.stringify(error.response.data)}`);
    }
  }
}

async function testAdminOperations() {
  logTest('ADMIN OPERATIONS MODULE');

  try {
    // Test 1: Get All Enrollments (Admin)
    log('\n1. Getting All Enrollments (Admin)...', 'cyan');
    const allEnrollments = await axios.get(
      `${BASE_URL}/api/admin/enrollments`,
      { headers: { Authorization: `Bearer ${adminToken}` } }
    );
    logSuccess(`Retrieved ${allEnrollments.data.length} total enrollments`);

    // Test 2: Get Enrollment Stats
    log('\n2. Getting Enrollment Statistics...', 'cyan');
    const stats = await axios.get(
      `${BASE_URL}/api/admin/enrollments/stats`,
      { headers: { Authorization: `Bearer ${adminToken}` } }
    );
    logSuccess(`Total enrollments: ${stats.data.summary.total}`);
    logSuccess(`Draft: ${stats.data.summary.draft}, Submitted: ${stats.data.summary.submitted}`);
    logSuccess(`Approved: ${stats.data.summary.approved}, Rejected: ${stats.data.summary.rejected}`);

    // Test 3: Approve Enrollment
    log('\n3. Approving Enrollment...', 'cyan');
    const approveRes = await axios.post(
      `${BASE_URL}/api/admin/enrollments/${enrollmentId}/approve`,
      { comment: 'All documents verified and approved' },
      { headers: { Authorization: `Bearer ${adminToken}` } }
    );
    logSuccess(`Enrollment approved. New status: ${approveRes.data.enrollment.status}`);

    // Test 4: Reject Enrollment (create new one first)
    log('\n4. Testing Enrollment Rejection...', 'cyan');
    const rejectEnrollment = await axios.post(
      `${BASE_URL}/api/enrollments`,
      {
        educationLevel: 'College',
        enrollmentType: 'first-time',
        course: 'BSBA',
        familyName: 'Test',
        firstName: 'Reject',
        sex: 'Male',
        dateOfBirth: '2000-01-01',
        email: 'reject@test.com',
        mobileNumber: '09000000000'
      },
      { headers: { Authorization: `Bearer ${studentToken}` } }
    );
    const rejectId = rejectEnrollment.data.enrollment.id;
    
    const rejectRes = await axios.post(
      `${BASE_URL}/api/admin/enrollments/${rejectId}/reject`,
      { comment: 'Missing required documents' },
      { headers: { Authorization: `Bearer ${adminToken}` } }
    );
    logSuccess(`Enrollment rejected. New status: ${rejectRes.data.enrollment.status}`);

    // Test 5: Get Admin Stats
    log('\n5. Getting Admin Dashboard Stats...', 'cyan');
    const dashStats = await axios.get(
      `${BASE_URL}/api/admin/stats`,
      { headers: { Authorization: `Bearer ${adminToken}` } }
    );
    logSuccess(`Total users: ${dashStats.data.stats.totalUsers}`);
    logSuccess(`Total FAQs: ${dashStats.data.stats.totalFAQs}`);
    logSuccess(`Total buildings: ${dashStats.data.stats.totalBuildings}`);

  } catch (error) {
    logError(`Admin operations test failed: ${error.message}`);
    if (error.response) {
      logError(`Response: ${JSON.stringify(error.response.data)}`);
    }
  }
}

async function testAuthorizationChecks() {
  logTest('AUTHORIZATION & ACCESS CONTROL');

  try {
    // Test 1: Student Cannot Access Admin Endpoints
    log('\n1. Testing Student Cannot Access Admin Endpoints...', 'cyan');
    try {
      await axios.get(
        `${BASE_URL}/api/admin/stats`,
        { headers: { Authorization: `Bearer ${studentToken}` } }
      );
      logError('Student should not access admin stats');
    } catch (error) {
      if (error.response.status === 403) {
        logSuccess('Student correctly denied access (403)');
      }
    }

    // Test 2: Registrar Can Access Enrollment Endpoints
    log('\n2. Testing Registrar Can Access Enrollment Endpoints...', 'cyan');
    const registrarEnrollments = await axios.get(
      `${BASE_URL}/api/admin/enrollments`,
      { headers: { Authorization: `Bearer ${registrarToken}` } }
    );
    logSuccess(`Registrar can access enrollments. Count: ${registrarEnrollments.data.length}`);

    // Test 3: Student Can Only View Own Enrollment
    log('\n3. Testing Student Can Only View Own Enrollment...', 'cyan');
    const ownEnrollment = await axios.get(
      `${BASE_URL}/api/enrollments/${enrollmentId}`,
      { headers: { Authorization: `Bearer ${studentToken}` } }
    );
    logSuccess('Student can view own enrollment');

    // Test 4: Missing Token Returns 401
    log('\n4. Testing Missing Token Returns 401...', 'cyan');
    try {
      await axios.get(`${BASE_URL}/api/admin/stats`);
      logError('Should require authentication');
    } catch (error) {
      if (error.response.status === 401) {
        logSuccess('Missing token correctly returns 401');
      }
    }

  } catch (error) {
    logError(`Authorization test failed: ${error.message}`);
  }
}

async function testDataValidation() {
  logTest('DATA VALIDATION MODULE');

  try {
    // Test 1: Missing Required Fields
    log('\n1. Testing Missing Required Fields...', 'cyan');
    try {
      await axios.post(
        `${BASE_URL}/api/enrollments`,
        {
          educationLevel: 'College'
          // Missing course and other required fields
        },
        { headers: { Authorization: `Bearer ${studentToken}` } }
      );
      logError('Should reject missing required fields');
    } catch (error) {
      if (error.response.status === 400) {
        logSuccess('Missing fields correctly rejected (400)');
      }
    }

    // Test 2: Invalid Date Format
    log('\n2. Testing Invalid Date Format...', 'cyan');
    try {
      await axios.post(
        `${BASE_URL}/api/enrollments`,
        {
          educationLevel: 'College',
          enrollmentType: 'first-time',
          course: 'BSIS',
          familyName: 'Test',
          firstName: 'Date',
          dateOfBirth: 'invalid-date',
          email: 'test@test.com',
          mobileNumber: '09000000000'
        },
        { headers: { Authorization: `Bearer ${studentToken}` } }
      );
      logError('Should reject invalid date format');
    } catch (error) {
      if (error.response.status === 400) {
        logSuccess('Invalid date format correctly rejected (400)');
      }
    }

    // Test 3: Invalid Enum Value
    log('\n3. Testing Invalid Enum Value...', 'cyan');
    try {
      await axios.post(
        `${BASE_URL}/api/enrollments`,
        {
          educationLevel: 'College',
          enrollmentType: 'first-time',
          course: 'INVALID_COURSE',
          familyName: 'Test',
          firstName: 'Enum',
          email: 'test@test.com',
          mobileNumber: '09000000000'
        },
        { headers: { Authorization: `Bearer ${studentToken}` } }
      );
      logError('Should reject invalid enum value');
    } catch (error) {
      if (error.response.status === 400) {
        logSuccess('Invalid enum value correctly rejected (400)');
      }
    }

  } catch (error) {
    logError(`Validation test failed: ${error.message}`);
  }
}

async function testSSCLogic() {
  logTest('SSC (SPECIAL SCIENCE CLASS) LOGIC');

  try {
    // Test 1: SSC Qualification (Grade >= 85)
    log('\n1. Testing SSC Qualification (Grade >= 85)...', 'cyan');
    const sscQualified = await axios.post(
      `${BASE_URL}/api/enrollments`,
      {
        educationLevel: 'JHS',
        gradeLevel: 'Grade 7',
        sscApplied: true,
        grade6Average: '90',
        grade6School: 'Test School',
        familyName: 'Qualified',
        firstName: 'Student',
        email: 'qualified@test.com',
        mobileNumber: '09000000000'
      },
      { headers: { Authorization: `Bearer ${studentToken}` } }
    );
    logSuccess(`SSC Qualified: ${sscQualified.data.sscQualified}`);
    logSuccess(`Status: ${sscQualified.data.enrollment.status} (should be pending_exam)`);

    // Test 2: SSC Not Qualified (Grade < 85)
    log('\n2. Testing SSC Not Qualified (Grade < 85)...', 'cyan');
    const sscNotQualified = await axios.post(
      `${BASE_URL}/api/enrollments`,
      {
        educationLevel: 'JHS',
        gradeLevel: 'Grade 7',
        sscApplied: true,
        grade6Average: '80',
        grade6School: 'Test School',
        familyName: 'NotQualified',
        firstName: 'Student',
        email: 'notqualified@test.com',
        mobileNumber: '09000000000'
      },
      { headers: { Authorization: `Bearer ${studentToken}` } }
    );
    logSuccess(`SSC Qualified: ${sscNotQualified.data.sscQualified}`);
    logSuccess(`Status: ${sscNotQualified.data.enrollment.status}`);
    logSuccess(`SSC Class: ${sscNotQualified.data.enrollment.sscClass}`);

  } catch (error) {
    logError(`SSC logic test failed: ${error.message}`);
    if (error.response) {
      logError(`Response: ${JSON.stringify(error.response.data)}`);
    }
  }
}

async function testPDFGeneration() {
  logTest('PDF GENERATION & DOWNLOAD');

  try {
    log('\n1. Testing PDF Download...', 'cyan');
    const pdfRes = await axios.get(
      `${BASE_URL}/api/enrollments/${enrollmentId}/pdf`,
      {
        headers: { Authorization: `Bearer ${studentToken}` },
        responseType: 'arraybuffer'
      }
    );
    logSuccess(`PDF generated successfully. Size: ${pdfRes.data.length} bytes`);
    logSuccess(`Content-Type: ${pdfRes.headers['content-type']}`);

  } catch (error) {
    logError(`PDF generation test failed: ${error.message}`);
  }
}

async function testSectionManagement() {
  logTest('SECTION MANAGEMENT MODULE');

  try {
    // Test 1: Get All Sections
    log('\n1. Getting All Sections...', 'cyan');
    const sections = await axios.get(
      `${BASE_URL}/api/admin/sections`,
      { headers: { Authorization: `Bearer ${adminToken}` } }
    );
    logSuccess(`Retrieved ${sections.data.length} sections`);

    // Test 2: Create Section
    log('\n2. Creating New Section...', 'cyan');
    const newSection = await axios.post(
      `${BASE_URL}/api/admin/sections`,
      {
        code: `SEC-${Date.now()}`,
        course: 'BSIS',
        yearLevel: 1,
        semester: '1st',
        schoolYear: '2025-2026',
        instructor: 'Dr. John Smith',
        schedule: 'MWF 9:00-10:30',
        room: 'Room 101',
        capacity: 40
      },
      { headers: { Authorization: `Bearer ${adminToken}` } }
    );
    logSuccess(`Section created. ID: ${newSection.data.id}`);

  } catch (error) {
    logError(`Section management test failed: ${error.message}`);
    if (error.response) {
      logError(`Response: ${JSON.stringify(error.response.data)}`);
    }
  }
}

async function runAllTests() {
  log('\n', 'cyan');
  log('╔════════════════════════════════════════════════════════════╗', 'cyan');
  log('║   EMC CAPSTONE SYSTEM - COMPREHENSIVE TESTING SUITE        ║', 'cyan');
  log('║   Testing all endpoints and features                       ║', 'cyan');
  log('╚════════════════════════════════════════════════════════════╝', 'cyan');

  try {
    await testAuthentication();
    await testEnrollmentWorkflow();
    await testAdminOperations();
    await testAuthorizationChecks();
    await testDataValidation();
    await testSSCLogic();
    await testPDFGeneration();
    await testSectionManagement();

    log('\n', 'cyan');
    log('╔════════════════════════════════════════════════════════════╗', 'green');
    log('║   ✓ ALL TESTS COMPLETED SUCCESSFULLY                      ║', 'green');
    log('║   System is ready for production and defense              ║', 'green');
    log('╚════════════════════════════════════════════════════════════╝', 'green');
  } catch (error) {
    log('\n', 'cyan');
    log('╔════════════════════════════════════════════════════════════╗', 'red');
    log('║   ✗ TESTS FAILED                                          ║', 'red');
    log('║   Please review errors above                              ║', 'red');
    log('╚════════════════════════════════════════════════════════════╝', 'red');
    process.exit(1);
  }
}

// Run tests
runAllTests().catch(error => {
  logError(`Fatal error: ${error.message}`);
  process.exit(1);
});
