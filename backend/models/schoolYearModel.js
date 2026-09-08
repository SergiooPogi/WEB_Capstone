import { DataTypes } from "sequelize";
import { sequelize } from "./db.js";

export const SchoolYear = sequelize.define("SchoolYear", {
  year: { type: DataTypes.STRING(20), allowNull: false, unique: true },
  isActive: { type: DataTypes.BOOLEAN, defaultValue: false },
}, { tableName: 'school_years' });
