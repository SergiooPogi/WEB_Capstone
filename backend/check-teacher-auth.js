import { sequelize } from './models/db.js';

const [u] = await sequelize.query("SELECT id, name, role, isActive FROM users WHERE id = 6");
console.log('Teacher user:', JSON.stringify(u[0]));

// Simulate what authenticateToken does — fetch by ID
const [[user]] = await sequelize.query(
  'SELECT id, email, name, role FROM users WHERE id = 6'
);
console.log('Auth result:', JSON.stringify(user));
console.log('Role check (should be teacher):', user.role === 'teacher' ? '✅ PASS' : '❌ FAIL — role is ' + user.role);

process.exit(0);
