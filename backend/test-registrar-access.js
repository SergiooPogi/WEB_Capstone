/*
    Test Registrar Access
    Verifies registrar can access their dashboard and endpoints
*/

import { User } from "./models/userModel.js";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "emc-secret-key-2025";

async function testRegistrarAccess() {
  try {
    console.log("🧪 Testing Registrar Access...\n");

    // Get registrar user
    const registrar = await User.findOne({ where: { email: "registrar@emc.edu.ph" } });
    if (!registrar) {
      console.error("❌ Registrar user not found");
      process.exit(1);
    }

    console.log("✅ Registrar found:", registrar.name);
    console.log("   Email:", registrar.email);
    console.log("   Role:", registrar.role);

    // Create JWT token
    const token = jwt.sign({ id: registrar.id, userId: registrar.id }, JWT_SECRET);
    console.log("\n✅ Token created");
    console.log(`   Token: ${token.substring(0, 30)}...\n`);

    // Test 1: Get all enrollments (Registrar should have access)
    console.log("📋 Test 1: GET /api/admin/enrollments (Registrar Access)");
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
    }

    // Test 2: Get enrollment stats
    console.log("\n📊 Test 2: GET /api/admin/enrollments/stats (Registrar Access)");
    response = await fetch("http://localhost:3000/api/admin/enrollments/stats", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      console.error(`❌ Failed: ${response.status} ${response.statusText}`);
    } else {
      const data = await response.json();
      console.log(`✅ Success: Got stats`);
      console.log(`   Total: ${data.summary.total}`);
      console.log(`   Submitted: ${data.summary.submitted}`);
      console.log(`   Approved: ${data.summary.approved}`);
    }

    // Test 3: Verify registrar role
    console.log("\n🔐 Test 3: Verify Registrar Role");
    if (registrar.role === "registrar") {
      console.log("✅ Registrar role verified");
    } else {
      console.error("❌ User is not a registrar");
    }

    console.log("\n🎉 All registrar access tests completed!");
    console.log("\n📝 Registrar Dashboard URL: http://localhost:5173/registrar");
    console.log("   Login: registrar@emc.edu.ph / registrar123");
    
    process.exit(0);
  } catch (error) {
    console.error("❌ Test error:", error.message);
    process.exit(1);
  }
}

testRegistrarAccess();
