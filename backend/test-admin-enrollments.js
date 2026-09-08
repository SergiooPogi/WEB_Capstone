/*
    Test Admin Enrollments API
    Tests the admin enrollment endpoints
*/

import { User } from "./models/userModel.js";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "emc-secret-key-2025";

async function testAdminEnrollments() {
  try {
    console.log("🧪 Testing Admin Enrollments API...\n");

    // Get admin user
    const admin = await User.findOne({ where: { email: "admin@emc.edu.ph" } });
    if (!admin) {
      console.error("❌ Admin user not found");
      process.exit(1);
    }

    // Create JWT token
    const token = jwt.sign({ id: admin.id, userId: admin.id }, JWT_SECRET);
    console.log("✅ Admin token created");
    console.log(`   Token: ${token.substring(0, 20)}...\n`);

    // Test 1: Get all enrollments
    console.log("📋 Test 1: GET /api/admin/enrollments");
    let response = await fetch("http://localhost:3000/api/admin/enrollments", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      console.error(`❌ Failed: ${response.status} ${response.statusText}`);
      const error = await response.text();
      console.error(`   Error: ${error}`);
    } else {
      const data = await response.json();
      console.log(`✅ Success: Got ${data.length} enrollments`);
      if (data.length > 0) {
        console.log(`   First enrollment: ${data[0].firstName} ${data[0].familyName}`);
      }
    }

    // Test 2: Get enrollment stats
    console.log("\n📊 Test 2: GET /api/admin/enrollments/stats");
    response = await fetch("http://localhost:3000/api/admin/enrollments/stats", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      console.error(`❌ Failed: ${response.status} ${response.statusText}`);
      const error = await response.text();
      console.error(`   Error: ${error}`);
    } else {
      const data = await response.json();
      console.log(`✅ Success: Got stats`);
      console.log(`   Total: ${data.summary.total}`);
      console.log(`   Draft: ${data.summary.draft}`);
      console.log(`   Submitted: ${data.summary.submitted}`);
      console.log(`   Approved: ${data.summary.approved}`);
      console.log(`   Rejected: ${data.summary.rejected}`);
    }

    console.log("\n🎉 All tests completed!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Test error:", error.message);
    process.exit(1);
  }
}

testAdminEnrollments();
