import { sequelize } from "./models/db.js";
const [users] = await sequelize.query("SELECT id, name, email, role, isVerified, verificationToken FROM users ORDER BY createdAt DESC");
users.forEach(u => console.log(`[${u.role}] ${u.name} | verified=${u.isVerified} | token=${u.verificationToken ? u.verificationToken.substring(0,20)+"..." : "null"}`));
process.exit(0);
