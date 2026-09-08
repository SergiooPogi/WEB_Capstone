import { sequelize } from "./models/db.js";
// Mark all existing users as verified so they can still log in
await sequelize.query("UPDATE users SET isVerified = 1 WHERE isVerified IS NULL OR isVerified = 0");
const [users] = await sequelize.query("SELECT id, name, email, role, isVerified FROM users");
console.log("Users verification status:");
users.forEach(u => console.log(`  [${u.role}] ${u.name} - verified: ${u.isVerified}`));
process.exit(0);
