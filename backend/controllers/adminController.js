/*
    MIT License
    
    Copyright (c) 2025 Christian I. Cabrera || XianFire Framework
    Mindoro State University - Philippines
*/

import { User } from "../models/userModel.js";
import { FAQ } from "../models/faqModel.js";
import { ChatLog } from "../models/chatLogModel.js";
import { Building } from "../models/buildingModel.js";
import { sequelize } from "../models/db.js";

await sequelize.sync();

// Set up associations
ChatLog.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Middleware to check admin role
export const requireAdmin = async (req, res, next) => {
  try {
    // Check for JWT token in Authorization header
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const jwt = await import('jsonwebtoken');
      const JWT_SECRET = process.env.JWT_SECRET || "emc-secret-key-2025";
      
      try {
        const decoded = jwt.default.verify(token, JWT_SECRET);
        const user = await User.findByPk(decoded.id);
        
        if (!user || user.role !== 'admin') {
          return res.status(403).json({ error: "Forbidden: Admin access required" });
        }
        
        req.user = user;
        return next();
      } catch (jwtError) {
        return res.status(401).json({ error: "Invalid or expired token" });
      }
    }
    
    // Fallback to session-based auth
    if (!req.session.userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    
    const user = await User.findByPk(req.session.userId);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ error: "Forbidden: Admin access required" });
    }
    
    req.user = user;
    next();
  } catch (err) {
    console.error("Auth error:", err);
    res.status(500).json({ error: "Authentication error" });
  }
};

export const getDashboardStats = async (req, res) => {
  try {
    const [totalUsers, totalFAQs, totalBuildings, totalChats] = await Promise.all([
      User.count(),
      FAQ.count({ where: { isActive: true } }),
      Building.count({ where: { isActive: true } }),
      ChatLog.count()
    ]);
    
    // Get recent activity (last 10 chat logs)
    const recentChats = await ChatLog.findAll({
      limit: 10,
      order: [['createdAt', 'DESC']]
    });
    
    // Get top FAQs by views
    const topFAQs = await FAQ.findAll({
      where: { isActive: true },
      order: [['views', 'DESC']],
      limit: 5
    });
    
    res.json({
      stats: {
        totalUsers,
        totalFAQs,
        totalBuildings,
        totalChats
      },
      recentChats,
      topFAQs
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    res.status(500).json({ error: "Failed to fetch dashboard stats" });
  }
};

// FAQ Management
export const getAllFAQs = async (req, res) => {
  try {
    const faqs = await FAQ.findAll({ order: [['createdAt', 'DESC']] });
    res.json(faqs);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch FAQs" });
  }
};

export const createFAQ = async (req, res) => {
  try {
    const { question, answer, category, keywords } = req.body;
    const faq = await FAQ.create({ question, answer, category, keywords: keywords || null });
    res.status(201).json(faq);
  } catch (error) {
    res.status(500).json({ error: "Failed to create FAQ" });
  }
};

export const updateFAQ = async (req, res) => {
  try {
    const faq = await FAQ.findByPk(req.params.id);
    if (!faq) return res.status(404).json({ error: "FAQ not found" });
    const { question, answer, category, keywords } = req.body;
    await faq.update({ question, answer, category, keywords: keywords !== undefined ? keywords : faq.keywords });
    res.json(faq);
  } catch (error) {
    res.status(500).json({ error: "Failed to update FAQ" });
  }
};

export const deleteFAQ = async (req, res) => {
  try {
    const faq = await FAQ.findByPk(req.params.id);
    if (!faq) return res.status(404).json({ error: "FAQ not found" });
    await faq.update({ isActive: false });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete FAQ" });
  }
};

// User Management
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'name', 'email', 'role', 'isActive', 'createdAt'],
      order: [['createdAt', 'DESC']]
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
};

export const updateUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    // Only allow updating safe fields — never role, password, or isVerified via this endpoint
    const { name, department } = req.body;
    const updates = {};
    if (name !== undefined) {
      if (!name.trim()) return res.status(400).json({ error: "Name cannot be empty" });
      if (name.length > 100) return res.status(400).json({ error: "Name must be 100 characters or less" });
      updates.name = name.trim();
    }
    if (department !== undefined) updates.department = department;
    await user.update(updates);
    res.json({ id: user.id, name: user.name, email: user.email, role: user.role, department: user.department });
  } catch (error) {
    res.status(500).json({ error: "Failed to update user" });
  }
};

// Delete user (admin only) — also deletes their enrollments
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const adminId = req.user?.id;

    // Prevent deleting yourself
    if (parseInt(id) === adminId) {
      return res.status(400).json({ error: "You cannot delete your own account" });
    }

    const [[user]] = await sequelize.query("SELECT * FROM users WHERE id = ?", { replacements: [id] });
    if (!user) return res.status(404).json({ error: "User not found" });

    // Prevent deleting other admins/registrars (but teachers can be deleted)
    if (user.role === "admin" || user.role === "registrar") {
      return res.status(403).json({ error: "Cannot delete admin or registrar accounts" });
    }

    // Get their enrollments (including section assignments)
    const [enrollments] = await sequelize.query(
      "SELECT id, sectionId FROM enrollment_records WHERE userId = ?",
      { replacements: [id] }
    );

    // For each enrollment that has a section, decrement the section's count
    for (const e of enrollments) {
      if (e.sectionId) {
        await sequelize.query(
          `UPDATE sections 
           SET currentEnrollment = MAX(0, currentEnrollment - 1), 
               updatedAt = datetime('now')
           WHERE id = ?`,
          { replacements: [e.sectionId] }
        );
      }
    }

    // Delete related data
    for (const e of enrollments) {
      await sequelize.query("DELETE FROM enrollment_subjects WHERE enrollmentId = ?", { replacements: [e.id] });
      await sequelize.query("DELETE FROM enrollment_documents WHERE enrollmentId = ?", { replacements: [e.id] });
    }
    await sequelize.query("DELETE FROM enrollment_records WHERE userId = ?", { replacements: [id] });
    await sequelize.query("DELETE FROM ChatLogs WHERE userId = ?", { replacements: [id] });
    await sequelize.query("DELETE FROM users WHERE id = ?", { replacements: [id] });

    res.json({ message: `User "${user.name}" deleted successfully` });
  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500).json({ error: "Failed to delete user" });
  }
};

// Delete user (admin only) — also deletes their enrollments
