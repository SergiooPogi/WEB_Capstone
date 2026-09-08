# Task 5.1 Implementation: Enrollment API Service

## Overview

This document describes the implementation of the enrollment API service for the College Enrollment Form System frontend. The service provides a clean interface for interacting with the backend enrollment API endpoints.

## Implementation Details

### Files Created

1. **`src/services/enrollmentApi.js`** - Main API service module
2. **`src/services/README.md`** - Documentation for the API service
3. **`src/services/enrollmentApi.test.example.js`** - Example test file for manual testing

### API Functions Implemented

All required functions from task 5.1 have been implemented:

#### 1. `createEnrollment(enrollmentData)`
- **Purpose**: Create a new enrollment record
- **Method**: POST /api/enrollments
- **Requirements**: 12.2, 12.3, 12.5
- **Features**:
  - Sends enrollment form data to backend
  - Automatically includes JWT token from localStorage
  - Returns created enrollment with ID
  - Handles validation errors and server errors

#### 2. `getEnrollments(options)`
- **Purpose**: Get all enrollments (admin only)
- **Method**: GET /api/enrollments
- **Requirements**: 16.1, 16.2, 16.3, 16.4
- **Features**:
  - Supports filtering by status (submitted, approved, rejected)
  - Supports searching by student name (case-insensitive)
  - Supports pagination (page, limit)
  - Returns enrollments with user data and pagination info

#### 3. `getEnrollmentById(enrollmentId)`
- **Purpose**: Get a single enrollment by ID
- **Method**: GET /api/enrollments/:id
- **Requirements**: 20.2
- **Features**:
  - Fetches complete enrollment record
  - Includes associated user data
  - Verifies user authorization (owner or admin)

#### 4. `getUserEnrollments(userId)`
- **Purpose**: Get all enrollments for a specific user
- **Method**: GET /api/enrollments/user/:userId
- **Requirements**: 19.1, 19.4
- **Features**:
  - Returns only enrollments for specified user
  - Verifies user authorization (owner or admin)
  - Sorted by creation date (newest first)

#### 5. `updateEnrollment(enrollmentId, enrollmentData)`
- **Purpose**: Update an existing enrollment record
- **Method**: PUT /api/enrollments/:id
- **Requirements**: 20.4
- **Features**:
  - Updates enrollment with partial data
  - Only owner can update (not admin)
  - Validates updated data
  - Updates timestamp automatically

#### 6. `updateEnrollmentStatus(enrollmentId, status)`
- **Purpose**: Update enrollment status (admin only)
- **Method**: PUT /api/enrollments/:id/status
- **Requirements**: 18.2, 18.3, 18.5
- **Features**:
  - Validates status value (submitted, approved, rejected)
  - Client-side validation before API call
  - Admin-only operation
  - Returns updated enrollment

#### 7. `downloadEnrollmentPDF(enrollmentId)`
- **Purpose**: Download enrollment PDF
- **Method**: GET /api/enrollments/:id/pdf
- **Requirements**: 13.1, 13.4, 13.5, 17.1, 17.3, 17.4
- **Features**:
  - Fetches PDF as blob
  - Creates temporary download link
  - Triggers browser download automatically
  - Cleans up temporary resources
  - Handles PDF generation errors

#### 8. `deleteEnrollment(enrollmentId)` (Bonus)
- **Purpose**: Delete an enrollment record
- **Method**: DELETE /api/enrollments/:id
- **Features**:
  - Owner or admin can delete
  - Returns success message

### Key Features

#### Authentication & Authorization
- All functions automatically include JWT token from localStorage
- Token is sent in Authorization header as Bearer token
- Handles authentication errors (401) and authorization errors (403)

#### Error Handling
- Centralized error handling with `handleResponse()` helper
- Extracts error messages from API responses
- Throws descriptive errors for easy debugging
- Logs errors to console for development

#### Token Management
- Reads token from localStorage automatically
- No need to pass token to each function
- Consistent token handling across all API calls

#### Response Handling
- Parses JSON responses automatically
- Validates response status codes
- Returns clean data objects
- Handles both success and error responses

### Usage Examples

#### Student User Example
```javascript
import { 
  createEnrollment, 
  getUserEnrollments, 
  downloadEnrollmentPDF 
} from './services/enrollmentApi';

// Create new enrollment
const enrollmentData = {
  studentType: 'New',
  course: 'BSIS',
  familyName: 'Doe',
  firstName: 'John',
  // ... other fields
};

try {
  const result = await createEnrollment(enrollmentData);
  console.log('Enrollment created:', result.enrollment.id);
  
  // Get user's enrollments
  const userId = 1; // From logged-in user
  const enrollments = await getUserEnrollments(userId);
  console.log('My enrollments:', enrollments);
  
  // Download PDF
  await downloadEnrollmentPDF(result.enrollment.id);
} catch (error) {
  console.error('Error:', error.message);
}
```

#### Admin User Example
```javascript
import { 
  getEnrollments, 
  updateEnrollmentStatus 
} from './services/enrollmentApi';

// Get all enrollments with filters
try {
  const result = await getEnrollments({
    status: 'submitted',
    search: 'John',
    page: 1,
    limit: 10
  });
  
  console.log('Enrollments:', result.enrollments);
  console.log('Total:', result.total);
  
  // Approve an enrollment
  const updated = await updateEnrollmentStatus(1, 'approved');
  console.log('Status updated:', updated.enrollment.status);
} catch (error) {
  console.error('Error:', error.message);
}
```

### Integration with Backend

The API service integrates seamlessly with the existing backend:

- **Base URL**: `http://localhost:3000/api/enrollments`
- **Authentication**: JWT tokens (Bearer authentication)
- **Content Type**: application/json
- **Error Format**: Consistent with backend error responses

### Testing

A comprehensive test example file is provided (`enrollmentApi.test.example.js`) with:

- Individual test functions for each API endpoint
- Sample test data
- Test suites for students and admins
- Manual testing instructions

To test the API service:

1. Start the backend server
2. Log in and get a JWT token
3. Open browser console
4. Import and run test functions

Example:
```javascript
import { runStudentTests } from './services/enrollmentApi.test.example';
await runStudentTests();
```

### Requirements Coverage

This implementation satisfies all requirements specified in task 5.1:

✅ Create src/services/enrollmentApi.js  
✅ Implement createEnrollment function  
✅ Implement getEnrollments function (admin)  
✅ Implement getEnrollmentById function  
✅ Implement getUserEnrollments function  
✅ Implement updateEnrollment function  
✅ Implement updateEnrollmentStatus function (admin)  
✅ Implement downloadEnrollmentPDF function  
✅ Add error handling and token management  
✅ All API integration requirements covered  

### Next Steps

The enrollment API service is now ready for integration with frontend components:

1. **Task 5.2**: Create form data utilities (preloadFormData, formatEnrollmentForDisplay, parseFormData)
2. **Task 5.3**: Create form validation utilities
3. **Task 6.x**: Implement EnrollmentForm component using this API service
4. **Task 7.x**: Implement AdminEnrollmentList component using this API service
5. **Task 8.x**: Implement StudentEnrollmentHistory component using this API service

### Notes

- The API service follows the existing frontend patterns (using fetch API)
- All functions are well-documented with JSDoc comments
- Error handling is consistent and user-friendly
- The service is ready for immediate use in React components
- No external dependencies required (uses native fetch API)

## Conclusion

Task 5.1 has been successfully completed. The enrollment API service provides a clean, well-documented interface for all enrollment-related API operations, with proper error handling, authentication, and token management.
