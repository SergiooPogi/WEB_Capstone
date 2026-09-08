/**
 * Migration: Add registrar verification fields and new statuses
 * Run: node backend/migrations/20260420000000-add-registrar-fields.js
 */
import { sequelize } from '../models/db.js';

async function migrate() {
  try {
    console.log('Running registrar fields migration...');

    // SQLite doesn't support ALTER COLUMN for ENUM, so we add new columns
    const queries = [
      // Registrar verification
      `ALTER TABLE enrollment_records ADD COLUMN registrar_remarks TEXT`,
      `ALTER TABLE enrollment_records ADD COLUMN verified_by INTEGER`,
      `ALTER TABLE enrollment_records ADD COLUMN verified_at DATETIME`,
      // TOR evaluation
      `ALTER TABLE enrollment_records ADD COLUMN tor_evaluated BOOLEAN DEFAULT 0`,
      `ALTER TABLE enrollment_records ADD COLUMN tor_remarks TEXT`,
    ];

    for (const q of queries) {
      try {
        await sequelize.query(q);
        console.log(`✅ ${q.split('ADD COLUMN')[1]?.trim() || q}`);
      } catch (e) {
        // Column may already exist
        if (e.message.includes('duplicate column')) {
          console.log(`⏭️  Column already exists, skipping`);
        } else {
          console.warn(`⚠️  ${e.message}`);
        }
      }
    }

    // For SQLite: status column is TEXT so 'verified' and 'returned' values
    // will work without needing to alter the ENUM — SQLite stores as TEXT.
    console.log('\n✅ Migration complete!');
    console.log('New statuses available: verified, returned');
    console.log('New columns: registrar_remarks, verified_by, verified_at, tor_evaluated, tor_remarks');

  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
}

migrate();
