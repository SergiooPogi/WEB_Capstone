import { sequelize } from "./models/db.js";
const [tables] = await sequelize.query("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name");
for (const t of tables) {
  const [cols] = await sequelize.query(`PRAGMA table_info(${t.name})`);
  console.log(`\n=== ${t.name} ===`);
  cols.forEach(c => {
    const pk = c.pk ? " [PK]" : "";
    const nn = c.notnull ? " NOT NULL" : "";
    const def = c.dflt_value ? ` DEFAULT ${c.dflt_value}` : "";
    console.log(`  ${c.name} ${c.type}${pk}${nn}${def}`);
  });
}
process.exit(0);
