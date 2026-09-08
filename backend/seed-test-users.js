/*
    Test Users Seeding Script
    Creates test credentials for all roles: student, registrar, admin
    
    MIT License
    Copyright (c) 2025 Christian I. Cabrera || XianFire Framework
    Mindoro State University - Philippines
*/

import bcrypt from "bcrypt";
import { User } from "./models/userModel.js";
import { sequelize } from "./models/db.js";

await sequelize.sync();

console.log("🌱 Seeding test users...\n");

try {
  // Check if users already exist
  const existingAdmin = await User.findOne({ where: { email: "admin@emc.edu.ph" } });
  const existingRegistrar = await User.findOne({ where: { email: "registrar@emc.edu.ph" } });
  const existingStudent = await User.findOne({ where: { email: "student@emc.edu.ph" } });

  // Create admin user
  if (!existingAdmin) {
    const adminPassword = await bcrypt.hash("admin123", 10);
    await User.create({
      name: "Admin User",
      email: "admin@emc.edu.ph",
      password: adminPassword,
      role: "admin",
      department: "Administration"
    });
    console.log("✅ Admin user created");
  } else {
    console.log("⏭️  Admin user already exists");
  }

  // Create registrar user
  if (!existingRegistrar) {
    const registrarPassword = await bcrypt.hash("registrar123", 10);
    await User.create({
      name: "Registrar User",
      email: "registrar@emc.edu.ph",
      password: registrarPassword,
      role: "registrar",
      department: "Registrar Office"
    });
    console.log("✅ Registrar user created");
  } else {
    console.log("⏭️  Registrar user already exists");
  }

  // Create student user
  if (!existingStudent) {
    const studentPassword = await bcrypt.hash("student123", 10);
    await User.create({
      name: "John Doe",
      email: "student@emc.edu.ph",
      password: studentPassword,
      role: "student"
    });
    console.log("✅ Student user created");
  } else {
    console.log("⏭️  Student user already exists");
  }

  console.log("\n📋 TEST CREDENTIALS:\n");
  console.log("═══════════════════════════════════════════════════════════");
  console.log("ADMIN ACCOUNT:");
  console.log("  Email:    admin@emc.edu.ph");
  console.log("  Password: admin123");
  console.log("  Role:     admin");
  console.log("═══════════════════════════════════════════════════════════");
  console.log("REGISTRAR ACCOUNT:");
  console.log("  Email:    registrar@emc.edu.ph");
  console.log("  Password: registrar123");
  console.log("  Role:     registrar");
  console.log("═══════════════════════════════════════════════════════════");
  console.log("STUDENT ACCOUNT:");
  console.log("  Email:    student@emc.edu.ph");
  console.log("  Password: student123");
  console.log("  Role:     student");
  console.log("═══════════════════════════════════════════════════════════\n");

  console.log("✅ Test users seeding completed!");
  process.exit(0);
} catch (error) {
  console.error("❌ Error seeding test users:", error);
  process.exit(1);
} finally {
  await sequelize.close();
}
