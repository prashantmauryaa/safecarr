const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.resolve(__dirname, 'carsafe.db');
const db = new Database(dbPath);

const initDb = () => {
  // Users table (Owners) - UPDATED for Email/Password
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE,
      password TEXT, -- Hashed password
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // QR Data table
  db.exec(`
    CREATE TABLE IF NOT EXISTS qr_profiles (
      qr_id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      owner_name TEXT,
      emergency_contacts TEXT, -- JSON string of contacts
      is_active INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(user_id) REFERENCES users(id)
    )
  `);

  // Incidents table (Optional tracking)
  db.exec(`
    CREATE TABLE IF NOT EXISTS incidents (
      id TEXT PRIMARY KEY,
      qr_id TEXT NOT NULL,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      location TEXT,
      FOREIGN KEY(qr_id) REFERENCES qr_profiles(qr_id)
    )
  `);

  console.log("Database initialized at " + dbPath);
};

module.exports = { db, initDb };
