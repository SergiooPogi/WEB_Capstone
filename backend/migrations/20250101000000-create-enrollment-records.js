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

export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('enrollment_records', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    
    // Foreign Key to Users table
    userId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    
    // Student Type and Identification
    studentType: {
      type: Sequelize.ENUM('New', 'Old'),
      allowNull: false
    },
    studentNumber: {
      type: Sequelize.STRING(50),
      allowNull: true
    },
    
    // Enrollment Period
    semester: {
      type: Sequelize.STRING(50),
      allowNull: true
    },
    academicYear: {
      type: Sequelize.STRING(20),
      allowNull: true
    },
    dateEnrolled: {
      type: Sequelize.DATEONLY,
      allowNull: true
    },
    
    // Course Information
    course: {
      type: Sequelize.ENUM('BEED', 'BSIS', 'BSBA', 'BSED', 'BSCrim'),
      allowNull: false
    },
    major: {
      type: Sequelize.STRING(100),
      allowNull: true
    },
    curriculumYear: {
      type: Sequelize.STRING(20),
      allowNull: true
    },
    
    // Admission Credentials (stored as JSON array)
    admissionCredentials: {
      type: Sequelize.JSON,
      allowNull: true,
      defaultValue: '[]'
    },
    
    // Personal Information
    familyName: {
      type: Sequelize.STRING(100),
      allowNull: true
    },
    firstName: {
      type: Sequelize.STRING(100),
      allowNull: true
    },
    middleName: {
      type: Sequelize.STRING(100),
      allowNull: true
    },
    sex: {
      type: Sequelize.ENUM('Male', 'Female'),
      allowNull: true
    },
    dateOfBirth: {
      type: Sequelize.DATEONLY,
      allowNull: true
    },
    placeOfBirth: {
      type: Sequelize.STRING(200),
      allowNull: true
    },
    
    // Contact Information
    email: {
      type: Sequelize.STRING(100),
      allowNull: true
    },
    mobileNumber: {
      type: Sequelize.STRING(20),
      allowNull: true
    },
    
    // Parent Information
    fatherName: {
      type: Sequelize.STRING(200),
      allowNull: true
    },
    fatherOccupation: {
      type: Sequelize.STRING(100),
      allowNull: true
    },
    fatherAddress: {
      type: Sequelize.TEXT,
      allowNull: true
    },
    motherName: {
      type: Sequelize.STRING(200),
      allowNull: true
    },
    motherOccupation: {
      type: Sequelize.STRING(100),
      allowNull: true
    },
    motherAddress: {
      type: Sequelize.TEXT,
      allowNull: true
    },
    
    // Guardian Information
    guardianName: {
      type: Sequelize.STRING(200),
      allowNull: true
    },
    guardianOccupation: {
      type: Sequelize.STRING(100),
      allowNull: true
    },
    guardianAddress: {
      type: Sequelize.TEXT,
      allowNull: true
    },
    
    // Educational Background (stored as JSON)
    educationalBackground: {
      type: Sequelize.JSON,
      allowNull: true,
      defaultValue: '{}'
    },
    
    // Subject Enrollment (stored as JSON array)
    subjects: {
      type: Sequelize.JSON,
      allowNull: true,
      defaultValue: '[]'
    },
    
    // Additional Information
    studentSignature: {
      type: Sequelize.STRING(200),
      allowNull: true
    },
    referredBy: {
      type: Sequelize.STRING(200),
      allowNull: true
    },
    
    // Status and Metadata
    status: {
      type: Sequelize.ENUM('submitted', 'approved', 'rejected'),
      allowNull: false,
      defaultValue: 'submitted'
    },
    
    // Timestamps
    createdAt: {
      type: Sequelize.DATE,
      allowNull: false
    },
    updatedAt: {
      type: Sequelize.DATE,
      allowNull: false
    }
  });

  // Add indexes for performance
  await queryInterface.addIndex('enrollment_records', ['userId'], {
    name: 'idx_enrollment_records_userId'
  });

  await queryInterface.addIndex('enrollment_records', ['status'], {
    name: 'idx_enrollment_records_status'
  });

  await queryInterface.addIndex('enrollment_records', ['createdAt'], {
    name: 'idx_enrollment_records_createdAt'
  });
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable('enrollment_records');
}
