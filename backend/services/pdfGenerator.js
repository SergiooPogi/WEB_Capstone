import { generateHSEnrollmentPDF } from './hsPdfGenerator.js';

export const formatEnrollmentData = (enrollment) => {
  return {
    ...enrollment,
    studentNumber: enrollment.studentNumber || '',
    semester: enrollment.semester || '',
    academicYear: enrollment.academicYear || '',
    dateEnrolled: enrollment.dateEnrolled || '',
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
  };
};

/**
 * Generate enrollment PDF — routes to HS PDF generator
 * (College enrollment has been removed from this system)
 */
export const generateEnrollmentPDF = (enrollment) => {
  return generateHSEnrollmentPDF(enrollment);
};
