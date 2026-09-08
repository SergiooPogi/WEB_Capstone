/*
    MIT License
    
    Copyright (c) 2025 Christian I. Cabrera || XianFire Framework
    Mindoro State University - Philippines
*/
    
import { DataTypes } from "sequelize";
import { sequelize } from "./db.js";

export const FAQ = sequelize.define("FAQ", {
  question: { type: DataTypes.TEXT, allowNull: false },
  answer: { type: DataTypes.TEXT, allowNull: false },
  category: { type: DataTypes.STRING, allowNull: false },
  keywords: { type: DataTypes.TEXT, allowNull: true }, // JSON array of keywords
  embedding: { type: DataTypes.TEXT, allowNull: true }, // For RAG vector storage
  views: { type: DataTypes.INTEGER, defaultValue: 0 },
  helpful: { type: DataTypes.INTEGER, defaultValue: 0 },
  notHelpful: { type: DataTypes.INTEGER, defaultValue: 0 },
  isActive: { type: DataTypes.BOOLEAN, defaultValue: true }
});
