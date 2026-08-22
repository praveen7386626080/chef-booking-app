// chef-backend/create_admin_ci.js
// Non-interactive admin seeding for CI/CD
// Usage:
//   ADMIN_USER=admin ADMIN_PASSWORD=Secret123 node create_admin_ci.js

const bcrypt = require('bcrypt');
const db = require('./database');

async function run() {
  const username = process.env.ADMIN_USER || 'admin';
  const password = process.env.ADMIN_PASSWORD;

  if (!password) {
    console.error('ERROR: ADMIN_PASSWORD env var is required');
    process.exit(1);
  }

  const saltRounds = 10;
  const hash = await bcrypt.hash(password, saltRounds);

  db.get('SELECT id FROM users WHERE username = ?', [username], (err, row) => {
    if (err) {
      console.error('DB error:', err);
      process.exit(1);
    }

    if (row) {
      db.run('UPDATE users SET password_hash = ? WHERE id = ?', [hash, row.id], function(err) {
        if (err) {
          console.error('Update error:', err);
          process.exit(1);
        }
        console.log(`Updated password for existing user "${username}"`);
        process.exit(0);
      });
    } else {
      db.run('INSERT INTO users (username, password_hash, role) VALUES (?, ?, ?)', [username, hash, 'admin'], function(err) {
        if (err) {
          console.error('Insert error:', err);
          process.exit(1);
        }
        console.log(`Created admin user "${username}" (id ${this.lastID})`);
        process.exit(0);
      });
    }
  });
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
