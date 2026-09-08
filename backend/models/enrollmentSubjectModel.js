import { DataTypes } from "sequelize";
import { sequelize } from "./db.js";
import { EnrollmentRecord } from "./enrollmentRecordModel.js";
import { Subject } from "./subjectModel.js";

export const EnrollmentSubject = sequelize.define("EnrollmentSubject", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  
  // Foreign Keys
  enrollmentId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: EnrollmentRecord,
      key: 'id'
    }
  },
  
  subjectId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Subject,
      key: 'id'
    }
  },
  
  // Subject Details (denormalized for quick access)
  subjectCode: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  
  subjectDescription: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  
  units: {
    type: DataTypes.DECIMAL(4, 1),
    allowNull: false,
    defaultValue: 3
  },
  
  // Section & Schedule
  sectionId: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  
  sectionName: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  
  schedule: {
    type: DataTypes.STRING(100),
    allowNull: true  // e.g., "MWF 8:00-9:00 AM"
  },
  
  instructor: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  
  room: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  
  // Assignment tracking
  assignedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  
  // Grade (after completion)
  grade: {
    type: DataTypes.STRING(5),
    allowNull: true  // e.g., "A", "B+", "3.0"
  },
  
  // Status
  status: {
    type: DataTypes.ENUM('enrolled', 'completed', 'dropped'),
    allowNull: false,
    defaultValue: 'enrolled'
  }
}, {
  tableName: 'enrollment_subjects',
  timestamps: true
});

// Set up associations
EnrollmentSubject.belongsTo(EnrollmentRecord, { foreignKey: 'enrollmentId', as: 'enrollment' });
EnrollmentRecord.hasMany(EnrollmentSubject, { foreignKey: 'enrollmentId', as: 'enrolledSubjects' });

EnrollmentSubject.belongsTo(Subject, { foreignKey: 'subjectId', as: 'subject' });
Subject.hasMany(EnrollmentSubject, { foreignKey: 'subjectId', as: 'enrollments' });

export { sequelize };
