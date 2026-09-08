// Simple test script to verify enrollment API
// Run with: node test-enrollment-simple.js

const API_URL = 'http://localhost:3000/api';

// Test data
const testEnrollment = {
  studentType: 'New',
  course: 'BSIS',
  studentNumber: '123456',
  semester: '1',
  academicYear: '2024-2025',
  familyName: 'Test',
  firstName: 'Student',
  admissionCredentials: ['f138'],
  subjects: []
};

async function testEnrollment() {
  try {
    console.log('Testing enrollment API...\n');
    
    // First, try to login to get a token
    console.log('Step 1: Logging in...');
    const loginResponse = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'password123'
      })
    });
    
    if (!loginResponse.ok) {
      console.error('Login failed:', loginResponse.status);
      console.log('Please create a test user first or update credentials in this script');
      return;
    }
    
    const loginData = await loginResponse.json();
    const token = loginData.token;
    console.log('✓ Login successful, token received\n');
    
    // Now try to create enrollment
    console.log('Step 2: Creating enrollment...');
    console.log('Sending data:', JSON.stringify(testEnrollment, null, 2));
    
    const enrollResponse = await fetch(`${API_URL}/enrollments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(testEnrollment)
    });
    
    console.log('Response status:', enrollResponse.status);
    
    const enrollData = await enrollResponse.json();
    console.log('Response data:', JSON.stringify(enrollData, null, 2));
    
    if (enrollResponse.ok) {
      console.log('\n✓ Enrollment created successfully!');
    } else {
      console.log('\n✗ Enrollment creation failed');
    }
    
  } catch (error) {
    console.error('Test error:', error.message);
    if (error.message.includes('fetch')) {
      console.log('\nMake sure the backend server is running on http://localhost:3000');
    }
  }
}

testEnrollment();
