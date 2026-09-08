import { DataTypes } from "sequelize";
import { sequelize } from "./db.js";

export const Program = sequelize.define("Program", {
  code: { type: DataTypes.STRING(20), allowNull: false, unique: true }, // BSED, BSBA, etc.
  name: { type: DataTypes.STRING(100), allowNull: false },
  majors: { type: DataTypes.JSON, allowNull: true, defaultValue: [] }, // array of major strings
  isActive: { type: DataTypes.BOOLEAN, defaultValue: true }
}, { tableName: 'programs' });
