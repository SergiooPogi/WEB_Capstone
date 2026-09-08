/**
 * Enrollment Form Validation Utilities
 */

export const validateEnrollmentForm = (data, educationLevel) => {
  const errors = [];

  // Required fields validation
  if (!data.firstName?.trim()) {
    errors.push('First name is required');
  }
  if (!data.familyName?.trim()) {
    errors.push('Family name is required');
  }
  if (!data.sex) {
    errors.push('Sex is required');
  }
  if (!data.dateOfBirth) {
    errors.push('Date of birth is required');
  }
  if (!data.email?.trim()) {
    errors.push('Email is required');
  } else if (!isValidEmail(data.email)) {
    errors.push('Email format is invalid');
  }
  if (!data.mobileNumber?.trim()) {
    errors.push('Mobile number is required');
  }

  // HS-specific validation
  if (!data.gradeLevel) {
    errors.push('Grade level is required');
  }
  if (educationLevel === 'SHS' && !data.strand) {
    errors.push('Strand is required for SHS');
  }
  if (!data.enrollmentType) {
    errors.push('Enrollment type is required');
  }

  return errors;
};

export const validateHSEnrollmentForm = (data, educationLevel) => {
  const errors = [];

  if (!data.firstName?.trim()) {
    errors.push('First name is required');
  }
  if (!data.familyName?.trim()) {
    errors.push('Family name is required');
  }
  if (!data.gradeLevel) {
    errors.push('Grade level is required');
  }
  if (educationLevel === 'SHS' && !data.strand) {
    errors.push('Strand is required for SHS');
  }

  return errors;
};

export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidPhoneNumber = (phone) => {
  // Philippine phone number format
  const phoneRegex = /^(\+63|0)?9\d{9}$/;
  return phoneRegex.test(phone.replace(/\D/g, ''));
};

export const getValidationErrorMessage = (errors) => {
  if (errors.length === 0) return null;
  if (errors.length === 1) return errors[0];
  return `${errors.length} validation errors:\n${errors.map((e, i) => `${i + 1}. ${e}`).join('\n')}`;
};

export const showValidationErrors = (errors, toast) => {
  if (errors.length === 0) return;
  
  if (errors.length === 1) {
    toast.error(errors[0], { duration: 5000 });
  } else {
    toast.error(`${errors.length} validation errors`, {
      description: errors.slice(0, 3).join('\n') + (errors.length > 3 ? `\n... and ${errors.length - 3} more` : ''),
      duration: 8000
    });
  }
};
