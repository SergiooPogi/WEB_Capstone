import { sequelize } from "./models/db.js";
import { sendVerificationEmail } from "./services/emailService.js";

const [[user]] = await sequelize.query("SELECT * FROM users WHERE role = 'student' AND isVerified = 0 LIMIT 1");
if (user) {
  console.log("Sending verification email to:", user.email);
  console.log("Token:", user.verificationToken);
  await sendVerificationEmail(user, user.verificationToken);
  console.log("Done!");
} else {
  console.log("No unverified students found");
}
process.exit(0);
