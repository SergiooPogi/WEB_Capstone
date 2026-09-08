import { sendWelcomeEmail, sendEnrollmentSubmittedEmail, sendEnrollmentApprovedEmail } from "./services/emailService.js";

const user = { name: "Sergio Folloso", email: "sergiofolloso0@gmail.com" };

// Test 1: Welcome
await sendWelcomeEmail(user);
console.log("1. Welcome email sent");

// Test 2: Enrollment submitted
await sendEnrollmentSubmittedEmail(user, {
  id: 99,
  educationLevel: "JHS",
  gradeLevel: "Grade 7",
  email: "sergiofolloso0@gmail.com",
  firstName: "Sergio"
});
console.log("2. Enrollment submitted email sent");

// Test 3: Approved with section
await sendEnrollmentApprovedEmail(user, {
  id: 99,
  educationLevel: "JHS",
  gradeLevel: "Grade 7",
  sectionName: "JHS-7A",
  email: "sergiofolloso0@gmail.com",
  firstName: "Sergio"
});
console.log("3. Enrollment approved email sent");

process.exit(0);
