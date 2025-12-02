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

// Create users table
await connection.execute(`
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  openId VARCHAR(64) NOT NULL UNIQUE,
  name TEXT,
  email VARCHAR(320),
  loginMethod VARCHAR(64),
  role ENUM('user','admin') NOT NULL DEFAULT 'user',
  createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  lastSignedIn TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
`);

// Create pests table
await connection.execute(`
CREATE TABLE IF NOT EXISTS pests (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL UNIQUE,
  latin VARCHAR(255),
  alsoKnownAs TEXT,
  keywords TEXT,
  pestGroups TEXT,
  pestTypes TEXT,
  managementApproaches TEXT,
  alert BOOLEAN NOT NULL DEFAULT FALSE,
  pinned BOOLEAN NOT NULL DEFAULT FALSE,
  visible BOOLEAN NOT NULL DEFAULT TRUE,
  featuredImage VARCHAR(500),
  link TEXT,
  createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
`);

// Create submissions table
await connection.execute(`
CREATE TABLE IF NOT EXISTS submissions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  pestId INT NOT NULL,
  pestTitle VARCHAR(255) NOT NULL,
  location VARCHAR(500) NOT NULL,
  observationDate TIMESTAMP NOT NULL,
  notes TEXT,
  impactWhenua ENUM('none','low','medium','high','severe'),
  impactWai ENUM('none','low','medium','high','severe'),
  impactTangata ENUM('none','low','medium','high','severe'),
  photoUrls TEXT,
  photoKeys TEXT,
  submitterName VARCHAR(255),
  submitterEmail VARCHAR(320),
  ipAddress VARCHAR(45),
  userAgent TEXT,
  createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
`);

console.log('✅ All tables created (users, pests, submissions)');

// Check if pests already exist AFTER creating tables
const [existing] = await connection.execute('SELECT COUNT(*) as count FROM pests');
console.log(`Current pest count: ${existing[0].count}`);
if (existing[0].count > 0) {
  console.log(`⚠️  Database already has ${existing[0].count} pests. Skipping import.`);
  await connection.end();
  process.exit(0);
}

console.log('No pests found. Starting import...');

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
