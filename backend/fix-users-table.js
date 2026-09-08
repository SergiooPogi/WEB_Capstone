import { sequelize } from "./models/db.js";
import crypto from "crypto";

// Set Sergio as unverified with a fresh token
const token = crypto.randomBytes(32).toString("hex");
const expires = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

await sequelize.query(
  "UPDATE users SET isVerified = 0, verificationToken = ?, verificationExpires = ? WHERE role = 'student'",
  { replacements: [token, expires] }
);

const [users] = await sequelize.query("SELECT id, name, role, isVerified, verificationToken FROM users");
console.log("Updated users:");
users.forEach(u => console.log(`  [${u.role}] ${u.name}: verified=${u.isVerified}, token=${u.verificationToken ? u.verificationToken.substring(0,16)+"..." : "null"}`));
process.exit(0);
