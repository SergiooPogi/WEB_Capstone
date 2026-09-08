/*
MIT License

Copyright (c) 2025 Christian I. Cabrera || XianFire Framework
Mindoro State University - Philippines

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

import { DataTypes } from "sequelize";
import { sequelize } from "./db.js";
import { User } from "./userModel.js";

export const Admission = sequelize.define("Admission", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: 'Reference to applicant/student'
  },
  
  educationLevel: {
    type: DataTypes.ENUM('JHS', 'SHS', 'College'),
    allowNull: false,
    comment: 'Education level applying for'
  },
  
  status: {
    type: DataTypes.ENUM('submitted', 'verified', 'approved', 'rejected'),
    allowNull: false,
    defaultValue: 'submitted',
    comment: 'Admission status progression'
  },
  
  documents: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: {},
    comment: 'Submitted documents (F138, TOR, etc.) with verification status'
  },
  
  verifiedBy: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'Registrar who verified documents'
  },
  
  verifiedAt: {
    type: DataTypes.DATE,
    allowNull: true,
    comment: 'Timestamp when documents were verified'
  },
  
  verificationNotes: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Notes from document verification'
  },
  
  approvedBy: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'Admin who approved admission'
  },
  
  approvedAt: {
    type: DataTypes.DATE,
    allowNull: true,
    comment: 'Timestamp when admission was approved'
  },
  
  rejectionReason: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Reason for rejection (if rejected)'
  },
  
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'admissions',
  timestamps: true,
  comment: 'Admission records with document verification and approval workflow'
});

// Set up associations
Admission.belongsTo(User, { foreignKey: 'userId', as: 'applicant' });
Admission.belongsTo(User, { foreignKey: 'verifiedBy', as: 'verifier' });
Admission.belongsTo(User, { foreignKey: 'approvedBy', as: 'approver' });

User.hasMany(Admission, { foreignKey: 'userId', as: 'admissions' });

export { sequelize };
