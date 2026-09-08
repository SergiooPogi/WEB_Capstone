// Pre-load form data from user account
export const preloadFormData = (user) => {
  if (!user) return {};
  
  // Split name into parts (assuming format: "FirstName MiddleName LastName" or "FirstName LastName")
  const nameParts = user.name?.trim().split(' ') || [];
  let firstName = '';
  let middleName = '';
  let familyName = '';
  
  if (nameParts.length === 1) {
    firstName = nameParts[0];
  } else if (nameParts.length === 2) {
    firstName = nameParts[0];
    familyName = nameParts[1];
  } else if (nameParts.length >= 3) {
    firstName = nameParts[0];
    middleName = nameParts.slice(1, -1).join(' ');
    familyName = nameParts[nameParts.length - 1];
  }
  
  return {
    firstName,
    middleName,
    familyName,
    email: user.email || '',
    mobileNumber: user.phone || ''
  };
};

// Format enrollment record for display in form
export const formatEnrollmentForDisplay = (enrollment) => {
  if (!enrollment) return {};
  
  return {
    studentType: enrollment.studentType || '',
    studentNumber: enrollment.studentNumber || '',
    semester: enrollment.semester || '',
    academicYear: enrollment.academicYear || '',
    dateEnrolled: enrollment.dateEnrolled || '',
    course: enrollment.course || '',
    major: enrollment.major || '',
    curriculumYear: enrollment.curriculumYear || '',
    admissionCredentials: enrollment.admissionCredentials || [],
    familyName: enrollment.familyName || '',
    firstName: enrollment.firstName || '',
    middleName: enrollment.middleName || '',
    sex: enrollment.sex || '',
    dateOfBirth: enrollment.dateOfBirth || '',
    placeOfBirth: enrollment.placeOfBirth || '',
    email: enrollment.email || '',
    mobileNumber: enrollment.mobileNumber || '',
    fatherName: enrollment.fatherName || '',
    fatherOccupation: enrollment.fatherOccupation || '',
    fatherAddress: enrollment.fatherAddress || '',
    motherName: enrollment.motherName || '',
    motherOccupation: enrollment.motherOccupation || '',
    motherAddress: enrollment.motherAddress || '',
    guardianName: enrollment.guardianName || '',
    guardianOccupation: enrollment.guardianOccupation || '',
    guardianAddress: enrollment.guardianAddress || '',
    educationalBackground: enrollment.educationalBackground || {},
    subjects: enrollment.subjects || [],
    studentSignature: enrollment.studentSignature || '',
    referredBy: enrollment.referredBy || ''
  };
};

// Parse form data for submission
export const parseFormData = (formData) => {
  return {
    studentType: formData.studentType,
    studentNumber: formData.studentNumber || null,
    semester: formData.semester || null,
    academicYear: formData.academicYear || null,
    dateEnrolled: formData.dateEnrolled || null,
    course: formData.course,
    major: formData.major || null,
    curriculumYear: formData.curriculumYear || null,
    admissionCredentials: formData.admissionCredentials || [],
    familyName: formData.familyName || null,
    firstName: formData.firstName || null,
    middleName: formData.middleName || null,
    sex: formData.sex || null,
    dateOfBirth: formData.dateOfBirth || null,
    placeOfBirth: formData.placeOfBirth || null,
    email: formData.email || null,
    mobileNumber: formData.mobileNumber || null,
    fatherName: formData.fatherName || null,
    fatherOccupation: formData.fatherOccupation || null,
    fatherAddress: formData.fatherAddress || null,
    motherName: formData.motherName || null,
    motherOccupation: formData.motherOccupation || null,
    motherAddress: formData.motherAddress || null,
    guardianName: formData.guardianName || null,
    guardianOccupation: formData.guardianOccupation || null,
    guardianAddress: formData.guardianAddress || null,
    educationalBackground: formData.educationalBackground || {},
    subjects: formData.subjects || [],
    studentSignature: formData.studentSignature || null,
    referredBy: formData.referredBy || null
  };
};

// Get major options based on course
export const getMajorOptions = (course) => {
  const majorMap = {
    'BSBA': ['Financial Management (F.M)', 'Marketing Management (M.M)'],
    'BSED': ['Filipino', 'English', 'Math', 'Science', 'Social Studies']
  };
  
  return majorMap[course] || [];
};
