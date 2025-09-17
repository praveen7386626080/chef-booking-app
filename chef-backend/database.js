// chef-backend/database.js
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Create/connect to SQLite database
const dbPath = path.join(__dirname, 'chef_database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err);
  } else {
    console.log('Connected to SQLite database');
  }
});

// Create contacts table if it doesn't exist
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS contacts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'unread',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`, (err) => {
    if (err) {
      console.error('Error creating table:', err);
    } else {
      console.log('Contacts table ready');
    }
  });
});

module.exports = db;