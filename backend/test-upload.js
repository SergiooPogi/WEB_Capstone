// Test the document upload directly
import { sequelize } from "./models/db.js";
import { EnrollmentDocument } from "./models/enrollmentDocumentModel.js";
import fs from "fs";
import path from "path";

// Simulate what the controller does
const enrollmentId = 91;
const uploadDir = path.join(process.cwd(), "public", "uploads", "documents", `enrollment-${enrollmentId}`);
fs.mkdirSync(uploadDir, { recursive: true });

// Write a test file
const testBuffer = Buffer.from("test content");
const filename = `f138-test-${Date.now()}.jpg`;
const filePath = path.join(uploadDir, filename);
fs.writeFileSync(filePath, testBuffer);
console.log("File written to:", filePath);
console.log("File exists:", fs.existsSync(filePath));

// Try to create DB record
const relativePath = `/uploads/documents/enrollment-${enrollmentId}/${filename}`;
try {
  const doc = await EnrollmentDocument.create({
    enrollmentId,
    documentType: "f138",
    documentLabel: "F-138",
    filePath: relativePath,
    originalName: "test.jpg",
    mimeType: "image/jpeg",
    fileSize: testBuffer.length,
  });
  console.log("DB record created:", doc.id);
} catch(err) {
  console.error("DB error:", err.message);
}

// Cleanup
fs.unlinkSync(filePath);
process.exit(0);
