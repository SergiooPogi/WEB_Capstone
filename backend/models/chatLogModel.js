/*
    MIT License
    
    Copyright (c) 2025 Christian I. Cabrera || XianFire Framework
    Mindoro State University - Philippines
*/
    
import { DataTypes } from "sequelize";
import { sequelize } from "./db.js";

export const ChatLog = sequelize.define("ChatLog", {
  userId: { type: DataTypes.INTEGER, allowNull: true },
  sessionId: { type: DataTypes.STRING, allowNull: false },
  userMessage: { type: DataTypes.TEXT, allowNull: false },
  botResponse: { type: DataTypes.TEXT, allowNull: false },
  confidence: { type: DataTypes.FLOAT, allowNull: true },
  matchedFaqId: { type: DataTypes.INTEGER, allowNull: true },
  responseTime: { type: DataTypes.INTEGER, allowNull: true }, // milliseconds
  wasHelpful: { type: DataTypes.BOOLEAN, allowNull: true }
});
