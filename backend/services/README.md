# PDF Generator Service

## Overview

The PDF Generator Service creates formatted PDF documents from enrollment records that match the Eastern Mindoro College enrollment slip layout.

## Installation

The service uses PDFKit library:

```bash
npm install pdfkit
```

## Usage

### Basic Usage

```javascript
import { generateEnrollmentPDF, formatEnrollmentData } from './services/pdfGenerator.js';

// Format enrollment data
const formattedData = formatEnrollmentData(enrollmentRecord);

// Generate PDF buffer
const pdfBuffer = await generateEnrollmentPDF(formattedData);

// Send as HTTP response
res.setHeader('Content-Type', 'application/pdf');
res.setHeader('Content-Disposition', 'attachment; filename="enrollment.pdf"');
res.send(pdfBuffer);
```

### Helper Functions

#### `formatEnrollmentData(enrollment)`
Ensures all enrollment fields are properly formatted with default values for missing fields.

**Parameters:**
- `enrollment` (Object): Raw enrollment record from database

**Returns:**
- Formatted enrollment object with all fields populated

#### `generateEnrollmentPDF(enrollment)`
Generates a PDF document from enrollment data.

**Parameters:**
- `enrollment` (Object): Formatted enrollment record

**Returns:**
- Promise<Buffer>: PDF document as a buffer

**Throws:**
- Error if PDF generation fails

## PDF Layout

The generated PDF includes the following sections:

1. **Header**: Eastern Mindoro College title and form name
2. **Student Information**: Student type and number
3. **Enrollment Period**: Semester, academic year, date enrolled
4. **Course Information**: Course, major, curriculum year
5. **Admission Credentials**: List of submitted documents
6. **Personal Information**: Name, sex, birth details, contact info
7. **Parent Information**: Father and mother details
8. **Guardian Information**: Guardian details (if applicable)
9. **Educational Background**: Previous schools attended
10. **Subject Enrollment**: Table of enrolled subjects
11. **Additional Information**: Signature and referral
12. **Submission Details**: Status and submission date
13. **Footer**: Document generation notice

## Features

- **Automatic pagination**: Adds new pages when content exceeds page height
- **Formatted dates**: Converts ISO dates to readable format
- **Null-safe**: Handles missing/optional fields gracefully
- **Table formatting**: Properly formatted subject enrollment table
- **Professional layout**: Matches official college form design

## Testing

Run the test script to verify PDF generation:

```bash
node test-pdf-generation.js
```

This will create a `test-enrollment.pdf` file with sample data.

## Requirements Validation

This service validates the following requirements:
- **13.2**: PDF contains all enrollment data
- **13.3**: PDF matches Eastern Mindoro College enrollment slip layout
