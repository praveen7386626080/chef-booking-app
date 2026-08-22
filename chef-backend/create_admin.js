const bcrypt = require('bcrypt');
const db = require('./database');
const readline = require('readline');

async function run() {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  const question = (q) => new Promise((res) => rl.question(q, res));

  const username = (await question('Admin username (default "admin"): ')) || 'admin';
  const password = (await question('Admin password: '));
  rl.close();

  if (!password) {
    console.error('Password required. Aborting.');
    process.exit(1);
  }

  const saltRounds = 10;
  bcrypt.hash(password, saltRounds, (err, hash) => {
    if (err) {
      console.error('Hashing error:', err);
      process.exit(1);
    }

    db.get('SELECT id FROM users WHERE username = ?', [username], (err, row) => {
      if (err) {
        console.error('DB error:', err);
        process.exit(1);
      }

      if (row) {
        db.run('UPDATE users SET password_hash = ? WHERE id = ?', [hash, row.id], function(err) {
          if (err) console.error('Update error:', err);
          else console.log(`Updated password for existing user "${username}"`);
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
  });
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});