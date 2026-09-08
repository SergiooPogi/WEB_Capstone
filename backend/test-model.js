import { EnrollmentRecord } from "./models/enrollmentRecordModel.js";
try {
  const e = await EnrollmentRecord.findByPk(91);
  console.log("Found:", e ? "yes" : "no");
  if (e) console.log("userId:", e.userId, "status:", e.status);
} catch(err) {
  console.error("Error:", err.message);
}
process.exit(0);
