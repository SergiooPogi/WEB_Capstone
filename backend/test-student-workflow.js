#!/usr/bin/env node

/**
 * COMPREHENSIVE STUDENT WORKFLOW TEST
 * Tests all student-facing endpoints and workflows
 */

const API = 'http://localhost:3000/api';
let token = '';
let studentId = '';

// Test credentials
const STUDENT_EMAIL = 'student@emc.edu.ph';
const STUDENT_PASSWORD = 'student123';

// Color codes for output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(color, ...args) {
  console.log(color, ...args, colors.reset);
}

async function test(name, fn) {
  try {
    log(colors.cyan, `\n▶ ${name}`);
    await fn();
    log(colors.green, `✓ ${name} PASSED`);
    return true;
  } catch (error) {
    log(colors.red, `✗ ${name} FAILED`);
    log(colors.red, `  Error: ${error.message}`);
    return false;
  }
}

async function request(method, path, body = null) {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    }
  };

  if (body) options.body = JSON.stringify(body);

  const response = await fetch(`${API}${path}`, options);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(`${response.status}: ${data.message || 'Unknown error'}`);
  }

  return data;
}

async function runTests() {
  log(colors.blue, '\n╔════════════════════════════════════════════════════════════╗');
  log(colors.blue, '║     STUDENT WORKFLOW COMPREHENSIVE TEST SUITE              ║');
  log(colors.blue, '╚════════════════════════════════════════════════════════════╝');

  let passed = 0;
  let failed = 0;

  // ─────────────────────────────────────────────────────────────────────────
  // PHASE 1: AUTHENTICATION
  // ─────────────────────────────────────────────────────────────────────────
  log(colors.blue, '\n📋 PHASE 1: AUTHENTICATION');

  if (await test('Login as student', async () => {
    const result = await request('POST', '/auth/login', {
      email: STUDENT_EMAIL,
      password: STUDENT_PASSWORD
    });
    if (!result.token) throw new Error('No token returned');
    if (!result.user) throw new Error('No user returned');
    token = result.token;
    studentId = result.user.id;
    log(colors.yellow, `  Student ID: ${studentId}`);
    log(colors.yellow, `  Token: ${token.substring(0, 20)}...`);
  })) passed++; else failed++;

  // ─────────────────────────────────────────────────────────────────────────
  // PHASE 2: ENROLLMENT CREATION
  // ─────────────────────────────────────────────────────────────────────────
  log(colors.blue, '\n📋 PHASE 2: ENROLLMENT CREATION');

  let enrollmentId = '';

  if (await test('Create college enrollment (first-time)', async () => {
    const result = await request('POST', '/enrollments', {
      educationLevel: 'College',
      enrollmentType: 'first-time',
      studentStatus: 'regular',
      course: 'BSED',
      major: 'English',
      curriculumYear: '1st Year',
      semester: '1',
      academicYear: '2024-2025',
      dateEnrolled: new Date().toISOString().split('T')[0],
      studentType: 'New',
      familyName: 'Doe',
      firstName: 'John',
      middleName: 'Q',
      sex: 'Male',
      dateOfBirth: '2005-01-15',
      placeOfBirth: 'Manila',
      email: STUDENT_EMAIL,
      mobileNumber: '09123456789',
      fatherName: 'Father Name',
      fatherOccupation: 'Engineer',
      fatherAddress: 'Manila',
      motherName: 'Mother Name',
      motherOccupation: 'Teacher',
      motherAddress: 'Manila',
      admissionCredentials: ['f138', 'f137a'],
      subjects: [
        { code: 'ENG101', description: 'English 101', units: 3 },
        { code: 'MAT101', description: 'Math 101', units: 4 }
      ]
    });
    if (!result.enrollment) throw new Error('No enrollment returned');
    enrollmentId = result.enrollment.id;
    log(colors.yellow, `  Enrollment ID: ${enrollmentId}`);
    log(colors.yellow, `  Status: ${result.enrollment.status}`);
  })) passed++; else failed++;

  // ─────────────────────────────────────────────────────────────────────────
  // PHASE 3: ENROLLMENT RETRIEVAL
  // ─────────────────────────────────────────────────────────────────────────
  log(colors.blue, '\n📋 PHASE 3: ENROLLMENT RETRIEVAL');

  if (await test('Get user enrollments', async () => {
    const result = await request('GET', `/enrollments/user/${studentId}`);
    if (!Array.isArray(result)) throw new Error('Expected array response');
    log(colors.yellow, `  Found ${result.length} enrollment(s)`);
  })) passed++; else failed++;

  if (enrollmentId && await test('Get enrollment by ID', async () => {
    const result = await request('GET', `/enrollments/${enrollmentId}`);
    if (!result.id) throw new Error('No enrollment ID in response');
    log(colors.yellow, `  Enrollment: ${result.familyName}, ${result.firstName}`);
    log(colors.yellow, `  Course: ${result.course} - ${result.major}`);
  })) passed++; else failed++;

  // ─────────────────────────────────────────────────────────────────────────
  // PHASE 4: SUBJECT SELECTION
  // ─────────────────────────────────────────────────────────────────────────
  log(colors.blue, '\n📋 PHASE 4: SUBJECT SELECTION');

  if (enrollmentId && await test('Get available subjects', async () => {
    const result = await request('GET', `/enrollments/${enrollmentId}/available-subjects`);
    if (!result.subjects) throw new Error('No subjects in response');
    log(colors.yellow, `  Found ${result.subjects.length} subject(s)`);
    if (result.subjects.length > 0) {
      log(colors.yellow, `  Sample: ${result.subjects[0].code} - ${result.subjects[0].description}`);
    }
  })) passed++; else failed++;

  if (enrollmentId && await test('Enroll in subjects', async () => {
    const result = await request('POST', `/enrollments/${enrollmentId}/enroll-subjects`, {
      subjectIds: [1, 2, 3]
    });
    log(colors.yellow, `  Enrolled in ${result.enrolledCount || 0} subject(s)`);
  })) passed++; else failed++;

  if (enrollmentId && await test('Get enrolled subjects', async () => {
    const result = await request('GET', `/enrollments/${enrollmentId}/subjects`);
    if (!result.subjects) throw new Error('No subjects in response');
    log(colors.yellow, `  Enrolled in ${result.subjects.length} subject(s)`);
    log(colors.yellow, `  Total units: ${result.totalUnits || 0}`);
  })) passed++; else failed++;

  // ─────────────────────────────────────────────────────────────────────────
  // PHASE 5: ENROLLMENT UPDATE
  // ─────────────────────────────────────────────────────────────────────────
  log(colors.blue, '\n📋 PHASE 5: ENROLLMENT UPDATE');

  if (enrollmentId && await test('Update enrollment', async () => {
    const result = await request('PUT', `/enrollments/${enrollmentId}`, {
      mobileNumber: '09987654321',
      email: STUDENT_EMAIL
    });
    if (!result.id) throw new Error('No enrollment ID in response');
    log(colors.yellow, `  Updated successfully`);
  })) passed++; else failed++;

  // ─────────────────────────────────────────────────────────────────────────
  // PHASE 6: PDF GENERATION
  // ─────────────────────────────────────────────────────────────────────────
  log(colors.blue, '\n📋 PHASE 6: PDF GENERATION');

  if (enrollmentId && await test('Download enrollment PDF', async () => {
    const response = await fetch(`${API}/enrollments/${enrollmentId}/pdf`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error(`${response.status}: ${response.statusText}`);
    const buffer = await response.arrayBuffer();
    if (buffer.byteLength === 0) throw new Error('Empty PDF');
    log(colors.yellow, `  PDF size: ${(buffer.byteLength / 1024).toFixed(2)} KB`);
  })) passed++; else failed++;

  // ─────────────────────────────────────────────────────────────────────────
  // PHASE 7: ACADEMIC DATA
  // ─────────────────────────────────────────────────────────────────────────
  log(colors.blue, '\n📋 PHASE 7: ACADEMIC DATA');

  if (await test('Get programs', async () => {
    const result = await request('GET', '/academic/programs');
    if (!Array.isArray(result)) throw new Error('Expected array response');
    log(colors.yellow, `  Found ${result.length} program(s)`);
  })) passed++; else failed++;

  if (await test('Get subjects', async () => {
    const result = await request('GET', '/academic/subjects?programCode=BSED&yearLevel=1&semester=1st');
    if (!Array.isArray(result)) throw new Error('Expected array response');
    log(colors.yellow, `  Found ${result.length} subject(s)`);
  })) passed++; else failed++;

  // ─────────────────────────────────────────────────────────────────────────
  // PHASE 8: ENROLLMENT DELETION
  // ─────────────────────────────────────────────────────────────────────────
  log(colors.blue, '\n📋 PHASE 8: ENROLLMENT DELETION');

  if (enrollmentId && await test('Delete enrollment', async () => {
    const result = await request('DELETE', `/enrollments/${enrollmentId}`);
    log(colors.yellow, `  Deleted successfully`);
  })) passed++; else failed++;

  // ─────────────────────────────────────────────────────────────────────────
  // SUMMARY
  // ─────────────────────────────────────────────────────────────────────────
  log(colors.blue, '\n╔════════════════════════════════════════════════════════════╗');
  log(colors.blue, '║                      TEST SUMMARY                         ║');
  log(colors.blue, '╚════════════════════════════════════════════════════════════╝');
  log(colors.green, `✓ Passed: ${passed}`);
  log(colors.red, `✗ Failed: ${failed}`);
  log(colors.blue, `Total:  ${passed + failed}`);

  if (failed === 0) {
    log(colors.green, '\n🎉 ALL TESTS PASSED! Student workflow is working correctly.');
  } else {
    log(colors.red, `\n⚠️  ${failed} test(s) failed. Please review the errors above.`);
  }

  process.exit(failed > 0 ? 1 : 0);
}

// Run tests
runTests().catch(error => {
  log(colors.red, 'Fatal error:', error.message);
  process.exit(1);
});
