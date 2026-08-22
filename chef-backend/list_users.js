const db = require('./database');

db.all('SELECT username, role, created_at FROM users', [], (err, rows) => {
  if (err) {
    console.error('DB error:', err.message);
    process.exit(1);
  }
  console.log(JSON.stringify(rows, null, 2));
  db.close(() => process.exit(0));
});
