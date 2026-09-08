/*
    MIT License
    
    Copyright (c) 2025 Christian I. Cabrera || XianFire Framework
    Mindoro State University - Philippines
*/
    
import { DataTypes } from "sequelize";
import { sequelize } from "./db.js";

export const Building = sequelize.define("Building", {
  name: { type: DataTypes.STRING, allowNull: false },
  shortName: { type: DataTypes.STRING, allowNull: false },
  category: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: false },
  offices: { type: DataTypes.TEXT, allowNull: true }, // JSON array
  hours: { type: DataTypes.STRING, allowNull: true },
  coordinates: { type: DataTypes.TEXT, allowNull: true }, // JSON {x, y, lat, lng}
  imageUrl: { type: DataTypes.STRING, allowNull: true },
  floorPlan: { type: DataTypes.TEXT, allowNull: true }, // JSON for floor plan data
  isActive: { type: DataTypes.BOOLEAN, defaultValue: true }
});
