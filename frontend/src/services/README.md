# Enrollment API Service

This directory contains API service modules for the College Enrollment Form System.

## enrollmentApi.js

Provides functions to interact with the enrollment API endpoints. All functions handle authentication via JWT tokens stored in localStorage.

### Available Functions

#### `createEnrollment(enrollmentData)`
Creates a new enrollment record.

**Parameters:**
- `enrollmentData` (Object): Enrollment form data

**Returns:** Promise<Object> - Created enrollment record with ID

**Example:**
```javascript
import { createEnrollment } from './services/enrollmentApi';

const enrollmentData = {
  studentType: 'New',
  course: 'BSIS',
  familyName: 'Doe',
  firstName: 'John',
  // ... other fields
};

try {
  const result = await createEnrollment(enrollmentData);
  console.log('Enrollment created:', result.enrollment);
} catch (error) {
  console.error('Failed to create enrollment:', error.message);
}
```

#### `getEnrollments(options)`
Gets all enrollments (admin only).

**Parameters:**
- `options` (Object): Query options
  - `status` (string): Filter by status (submitted, approved, rejected)
  - `search` (string): Search by student name
  - `page` (number): Page number for pagination (default: 1)
  - `limit` (number): Number of records per page (default: 10)

**Returns:** Promise<Object> - Object containing enrollments array, total count, and pagination info

**Example:**
```javascript
import { getEnrollments } from './services/enrollmentApi';

try {
  const result = await getEnrollments({
    status: 'submitted',
    search: 'John',
    page: 1,
    limit: 10
  });
  console.log('Enrollments:', result.enrollments);
  console.log('Total:', result.total);
} catch (error) {
  console.error('Failed to fetch enrollments:', error.message);
}
```

#### `getEnrollmentById(enrollmentId)`
Gets a single enrollment by ID.

**Parameters:**
- `enrollmentId` (number): Enrollment record ID

**Returns:** Promise<Object> - Enrollment record with user data

**Example:**
```javascript
import { getEnrollmentById } from './services/enrollmentApi';

try {
  const enrollment = await getEnrollmentById(1);
  console.log('Enrollment:', enrollment);
} catch (error) {
  console.error('Failed to fetch enrollment:', error.message);
}
```

#### `getUserEnrollments(userId)`
Gets all enrollments for a specific user.

**Parameters:**
- `userId` (number): User ID

**Returns:** Promise<Array> - Array of enrollment records for the user

**Example:**
```javascript
import { getUserEnrollments } from './services/enrollmentApi';

try {
  const enrollments = await getUserEnrollments(1);
  console.log('User enrollments:', enrollments);
} catch (error) {
  console.error('Failed to fetch user enrollments:', error.message);
}
```

#### `updateEnrollment(enrollmentId, enrollmentData)`
Updates an existing enrollment record.

**Parameters:**
- `enrollmentId` (number): Enrollment record ID
- `enrollmentData` (Object): Updated enrollment data

**Returns:** Promise<Object> - Updated enrollment record

**Example:**
```javascript
import { updateEnrollment } from './services/enrollmentApi';

try {
  const result = await updateEnrollment(1, {
    semester: '2nd Semester',
    academicYear: '2024-2025'
  });
  console.log('Enrollment updated:', result.enrollment);
} catch (error) {
  console.error('Failed to update enrollment:', error.message);
}
```

#### `updateEnrollmentStatus(enrollmentId, status)`
Updates enrollment status (admin only).

**Parameters:**
- `enrollmentId` (number): Enrollment record ID
- `status` (string): New status (submitted, approved, rejected)

**Returns:** Promise<Object> - Updated enrollment record

**Example:**
```javascript
import { updateEnrollmentStatus } from './services/enrollmentApi';

try {
  const result = await updateEnrollmentStatus(1, 'approved');
  console.log('Status updated:', result.enrollment);
} catch (error) {
  console.error('Failed to update status:', error.message);
}
```

#### `downloadEnrollmentPDF(enrollmentId)`
Downloads enrollment PDF. This function triggers a browser download.

**Parameters:**
- `enrollmentId` (number): Enrollment record ID

**Returns:** Promise<void> - Resolves when download is initiated

**Example:**
```javascript
import { downloadEnrollmentPDF } from './services/enrollmentApi';

try {
  await downloadEnrollmentPDF(1);
  console.log('PDF download initiated');
} catch (error) {
  console.error('Failed to download PDF:', error.message);
}
```

#### `deleteEnrollment(enrollmentId)`
Deletes an enrollment record.

**Parameters:**
- `enrollmentId` (number): Enrollment record ID

**Returns:** Promise<Object> - Success message

**Example:**
```javascript
import { deleteEnrollment } from './services/enrollmentApi';

try {
  const result = await deleteEnrollment(1);
  console.log('Enrollment deleted:', result.message);
} catch (error) {
  console.error('Failed to delete enrollment:', error.message);
}
```

### Error Handling

All functions throw errors with descriptive messages when operations fail. Always wrap API calls in try-catch blocks to handle errors gracefully.

**Common Error Scenarios:**
- **401 Unauthorized**: User is not authenticated (token missing or invalid)
- **403 Forbidden**: User doesn't have permission to perform the action
- **404 Not Found**: Enrollment record not found
- **400 Bad Request**: Validation errors or invalid data
- **500 Internal Server Error**: Server-side error

### Authentication

All API functions automatically include the JWT token from localStorage in the Authorization header. Make sure the user is logged in and the token is stored before calling these functions.

**Token Storage:**
```javascript
// After successful login
localStorage.setItem('token', jwtToken);

// To check if user is authenticated
const token = localStorage.getItem('token');
if (!token) {
  // Redirect to login
}
```

### API Base URL

The API base URL is currently set to `http://localhost:3000/api/enrollments`. Update this in the `enrollmentApi.js` file if your backend runs on a different URL.
