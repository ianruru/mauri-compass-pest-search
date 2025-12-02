import mysql from 'mysql2/promise';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Read DATABASE_URL from environment
const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error('❌ DATABASE_URL environment variable is not set');
  process.exit(1);
}

console.log('Connecting to database...');
const connection = await mysql.createConnection(DATABASE_URL);
console.log('✅ Connected to database');

// Create tables first
console.log('Creating tables...');

await connection.execute(`
CREATE TABLE IF NOT EXISTS pests (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  latin VARCHAR(255),
  alsoKnownAs TEXT,
  keywords TEXT,
  pestGroups TEXT,
  pestTypes TEXT,
  managementApproaches TEXT,
  alert BOOLEAN DEFAULT FALSE,
  pinned BOOLEAN DEFAULT FALSE,
  visible BOOLEAN DEFAULT TRUE,
  featuredImage TEXT,
  link TEXT,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
`);

console.log('✅ Tables created');

// Check if pests already exist
const [existing] = await connection.execute('SELECT COUNT(*) as count FROM pests');
if (existing[0].count > 0) {
  console.log(`⚠️  Database already has ${existing[0].count} pests. Skipping import.`);
  await connection.end();
  process.exit(0);
}

// Read and execute SQL import file
const sqlFile = join(__dirname, 'pests-import.sql');
const sqlStatements = readFileSync(sqlFile, 'utf-8').split(';\n').filter(s => s.trim());

console.log(`Importing ${sqlStatements.length} pests...`);

for (const statement of sqlStatements) {
  if (statement.trim()) {
    await connection.execute(statement);
  }
}

// Verify
const [rows] = await connection.execute('SELECT COUNT(*) as count FROM pests WHERE visible = 1');
console.log(`✅ Successfully imported ${rows[0].count} visible pests!`);

await connection.end();
console.log('✅ Import complete!');
