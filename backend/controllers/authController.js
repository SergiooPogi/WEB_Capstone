import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { User, sequelize } from "../models/userModel.js";
import { sendWelcomeEmail, sendOtpEmail } from "../services/emailService.js";

await sequelize.sync();

const JWT_SECRET = process.env.JWT_SECRET || "emc-secret-key-2025";
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

export const loginPage = (req, res) => res.render("login", { title: "Login" });
export const registerPage = (req, res) => res.render("register", { title: "Register" });
export const forgotPasswordPage = (req, res) => res.render("forgotpassword", { title: "Forgot Password" });
export const dashboardPage = (req, res) => {
  if (!req.session.userId) return res.redirect("/login");
  res.render("dashboard", { title: "Dashboard" });
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "Email and password are required" });

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(401).json({ message: "Invalid email or password" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: "Invalid email or password" });

    // Check email verification — only required for students
    if (user.role === 'student' && (!user.isVerified || user.isVerified === 0 || user.isVerified === '0')) {
      return res.status(403).json({
        message: "Please verify your email before logging in. Check your inbox for the verification link.",
        needsVerification: true,
        email: user.email
      });
    }

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: "7d" });
    req.session.userId = user.id;

    res.json({
      message: "Login successful",
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error. Please try again." });
  }
};

export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) return res.status(400).json({ message: "Email already registered" });

    const hashed = await bcrypt.hash(password, 10);

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    const user = await User.create({
      name,
      email,
      password: hashed,
      isVerified: false,
      verificationToken: otp,
      verificationExpires: otpExpires,
    });

    // Send OTP email
    try {
      await sendOtpEmail(user, otp);
    } catch (emailErr) {
      console.error("[Auth] Failed to send OTP email:", emailErr.message);
    }

    res.status(201).json({
      message: "Registration successful! A 6-digit OTP has been sent to your email.",
      requiresVerification: true,
      email,
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Server error. Please try again." });
  }
};

// POST /api/auth/verify-otp
export const verifyEmail = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ success: false, message: "Email and OTP are required." });

    const [[user]] = await sequelize.query(
      "SELECT * FROM users WHERE email = ?",
      { replacements: [email] }
    );

    if (!user) {
      return res.status(400).json({ success: false, message: "No account found with that email." });
    }

    if (user.isVerified) {
      return res.json({ success: true, message: "Account already verified. You can log in." });
    }

    if (!user.verificationToken || user.verificationToken !== otp.trim()) {
      return res.status(400).json({ success: false, message: "Incorrect OTP. Please try again." });
    }

    if (user.verificationExpires && new Date(user.verificationExpires) < new Date()) {
      return res.status(400).json({ success: false, message: "OTP has expired. Please request a new one." });
    }

    await sequelize.query(
      "UPDATE users SET isVerified = 1, verificationToken = NULL, verificationExpires = NULL, updatedAt = datetime('now') WHERE id = ?",
      { replacements: [user.id] }
    );

    try { await sendWelcomeEmail(user); } catch (_) {}

    res.json({ success: true, message: "Email verified successfully! You can now log in." });
  } catch (error) {
    console.error("Verify OTP error:", error);
    res.status(500).json({ success: false, message: "Server error during verification." });
  }
};

// POST /api/auth/resend-verification
export const resendVerification = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: "No account found with that email" });
    if (user.isVerified) return res.status(400).json({ message: "This account is already verified" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await sequelize.query(
      "UPDATE users SET verificationToken = ?, verificationExpires = ?, updatedAt = datetime('now') WHERE id = ?",
      { replacements: [otp, otpExpires, user.id] }
    );

    await sendOtpEmail(user, otp);
    res.json({ message: "A new OTP has been sent to your email." });
  } catch (error) {
    console.error("Resend OTP error:", error);
    res.status(500).json({ message: "Failed to resend OTP." });
  }
};

export const logoutUser = (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(500).json({ message: "Logout failed" });
    res.clearCookie("connect.sid");
    res.json({ message: "Logout successful" });
  });
};