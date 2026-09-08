import { sequelize } from "./models/db.js";
// Check recent enrollments and their docs
const [recent] = await sequelize.query("SELECT id, firstName, userId FROM enrollment_records ORDER BY createdAt DESC LIMIT 5");
console.log("Recent enrollments:", JSON.stringify(recent));
const [docs] = await sequelize.query("SELECT * FROM enrollment_documents ORDER BY createdAt DESC LIMIT 5");
console.log("Recent docs:", JSON.stringify(docs));
process.exit(0);
