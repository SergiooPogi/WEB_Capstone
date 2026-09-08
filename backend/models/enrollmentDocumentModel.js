import { DataTypes } from "sequelize";
import { sequelize } from "./db.js";

export const EnrollmentDocument = sequelize.define("EnrollmentDocument", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  enrollmentId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  documentType: {
    // matches the credential key: f138, f137a, cgmc, tor, birthCert, marriageCert
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  documentLabel: {
    // human-readable label e.g. "F-138"
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  filePath: {
    type: DataTypes.STRING(500),
    allowNull: false,
  },
  originalName: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  mimeType: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  fileSize: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
}, {
  tableName: "enrollment_documents",
  timestamps: true,
});
