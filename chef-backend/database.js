// chef-backend/database.js - Supabase (PostgreSQL & JS Client) Database Module
const bcrypt = require('bcryptjs');

let db;

const databaseUrl = process.env.DATABASE_URL ? process.env.DATABASE_URL.trim() : '';
const supabaseUrl = process.env.SUPABASE_URL ? process.env.SUPABASE_URL.trim() : '';
const supabaseKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || '').trim();

if (databaseUrl) {
  // ==================== SUPABASE POSTGRESQL POOL MODE ====================
  const { Pool } = require('pg');
  
  const pool = new Pool({
    connectionString: databaseUrl,
    ssl: {
      rejectUnauthorized: false
    },
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
  });

  pool.on('error', (err) => {
    console.error('❌ Supabase Postgres pool error on idle client:', err.message);
  });

  console.log('⚡ Initializing Supabase PostgreSQL database connection (via DATABASE_URL)...');

  function preparePgQuery(sql) {
    let i = 1;
    return sql.replace(/\?/g, () => `$${i++}`);
  }

  db = {
    all(sql, params, callback) {
      if (typeof params === 'function') {
        callback = params;
        params = [];
      }
      const pgSql = preparePgQuery(sql);
      pool.query(pgSql, params || [])
        .then(res => {
          if (callback) callback(null, res.rows);
        })
        .catch(err => {
          console.error('DB all error:', err.message, 'SQL:', pgSql);
          if (callback) callback(err, []);
        });
    },

    get(sql, params, callback) {
      if (typeof params === 'function') {
        callback = params;
        params = [];
      }
      const pgSql = preparePgQuery(sql);
      pool.query(pgSql, params || [])
        .then(res => {
          if (callback) callback(null, res.rows[0]);
        })
        .catch(err => {
          console.error('DB get error:', err.message, 'SQL:', pgSql);
          if (callback) callback(err, null);
        });
    },

    run(sql, params, callback) {
      if (typeof params === 'function') {
        callback = params;
        params = [];
      }
      let pgSql = preparePgQuery(sql);
      const isInsert = /^\s*INSERT\s+INTO/i.test(pgSql);
      if (isInsert && !/RETURNING/i.test(pgSql)) {
        pgSql += ' RETURNING id';
      }

      pool.query(pgSql, params || [])
        .then(res => {
          const context = {
            lastID: res.rows && res.rows[0] ? res.rows[0].id : null,
            changes: res.rowCount
          };
          if (callback) callback.call(context, null);
        })
        .catch(err => {
          console.error('DB run error:', err.message, 'SQL:', pgSql);
          if (callback) callback.call({ changes: 0 }, err);
        });
    },

    serialize(fn) {
      if (fn) fn();
    },

    close(callback) {
      pool.end(callback || (() => {}));
    }
  };

  async function initPgTables() {
    try {
      await pool.query(`
        CREATE TABLE IF NOT EXISTS contacts (
          id BIGSERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) NOT NULL,
          message TEXT NOT NULL,
          status VARCHAR(50) DEFAULT 'unread',
          created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
        );
      `);
      await pool.query(`
        CREATE TABLE IF NOT EXISTS orders (
          id BIGSERIAL PRIMARY KEY,
          customer_name VARCHAR(255) NOT NULL,
          customer_phone VARCHAR(50) NOT NULL,
          customer_email VARCHAR(255),
          dish_name VARCHAR(255) NOT NULL,
          dish_price VARCHAR(100) NOT NULL,
          booking_date VARCHAR(100) NOT NULL,
          number_of_guests INTEGER NOT NULL,
          delivery_address TEXT NOT NULL,
          special_requests TEXT,
          status VARCHAR(50) DEFAULT 'pending',
          created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
        );
      `);
      await pool.query(`
        CREATE TABLE IF NOT EXISTS users (
          id BIGSERIAL PRIMARY KEY,
          username VARCHAR(255) UNIQUE NOT NULL,
          password_hash TEXT NOT NULL,
          role VARCHAR(50) DEFAULT 'admin',
          created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
        );
      `);
      await pool.query(`
        CREATE INDEX IF NOT EXISTS idx_contacts_created_at ON contacts(created_at DESC);
        CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
        CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
      `);
      const userRes = await pool.query('SELECT COUNT(*) as count FROM users');
      if (parseInt(userRes.rows[0].count, 10) === 0) {
        const defaultUser = process.env.ADMIN_USER || 'admin';
        const defaultPass = process.env.ADMIN_PASSWORD || 'Praveen@123';
        const hash = await bcrypt.hash(defaultPass, 10);
        await pool.query('INSERT INTO users (username, password_hash, role) VALUES ($1, $2, $3)', [defaultUser, hash, 'admin']);
        console.log(`✅ Default admin user "${defaultUser}" created successfully on Supabase.`);
      }
      console.log('🚀 Supabase PostgreSQL database is connected and ready!');
    } catch (err) {
      console.error('❌ Error initializing Supabase database tables:', err.message);
    }
  }

  initPgTables();

} else if (supabaseUrl && supabaseKey) {
  // ==================== SUPABASE JS CLIENT MODE ====================
  const { createClient } = require('@supabase/supabase-js');
  const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: { persistSession: false }
  });

  console.log('⚡ Initializing Supabase client connection (via SUPABASE_URL & API KEY)...');

  // Supabase JS Query Translator
  async function executeSupabaseQuery(type, sql, params = []) {
    const cleanSql = sql.trim().replace(/\s+/g, ' ');
    
    // ----------------- USERS QUERIES -----------------
    if (/FROM users/i.test(cleanSql)) {
      if (/COUNT\(\*\)/i.test(cleanSql)) {
        const { count, error } = await supabase.from('users').select('*', { count: 'exact', head: true });
        if (error) throw error;
        return type === 'get' ? { count: count || 0 } : [{ count: count || 0 }];
      }

      if (/WHERE username\s*=\s*\?/i.test(cleanSql)) {
        const username = params[0];
        const { data, error } = await supabase.from('users').select('*').eq('username', username);
        if (error) throw error;
        return type === 'get' ? (data && data[0] ? data[0] : null) : (data || []);
      }

      const { data, error } = await supabase.from('users').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return type === 'get' ? (data && data[0] ? data[0] : null) : (data || []);
    }

    if (/INSERT INTO users/i.test(cleanSql)) {
      const [username, password_hash, role] = params;
      const { data, error } = await supabase.from('users').insert([{ username, password_hash, role: role || 'admin' }]).select();
      if (error) throw error;
      return { lastID: data && data[0] ? data[0].id : null, changes: data ? data.length : 1 };
    }

    if (/UPDATE users SET password_hash\s*=\s*\?\s*WHERE id\s*=\s*\?/i.test(cleanSql)) {
      const [newHash, id] = params;
      const { data, error } = await supabase.from('users').update({ password_hash: newHash }).eq('id', id).select();
      if (error) throw error;
      return { changes: data ? data.length : 1 };
    }

    // ----------------- CONTACTS QUERIES -----------------
    if (/FROM contacts/i.test(cleanSql)) {
      if (/WHERE\s+name\s+LIKE/i.test(cleanSql)) {
        const rawSearch = (params[0] || '').replace(/%/g, '');
        const { data, error } = await supabase
          .from('contacts')
          .select('*')
          .or(`name.ilike.%${rawSearch}%,email.ilike.%${rawSearch}%,message.ilike.%${rawSearch}%`)
          .order('created_at', { ascending: false });
        if (error) throw error;
        return type === 'get' ? (data && data[0] ? data[0] : null) : (data || []);
      }

      const { data, error } = await supabase.from('contacts').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return type === 'get' ? (data && data[0] ? data[0] : null) : (data || []);
    }

    if (/INSERT INTO contacts/i.test(cleanSql)) {
      const [name, email, message] = params;
      const { data, error } = await supabase.from('contacts').insert([{ name, email, message }]).select();
      if (error) throw error;
      return { lastID: data && data[0] ? data[0].id : null, changes: data ? data.length : 1 };
    }

    if (/UPDATE contacts SET status\s*=\s*\?\s*WHERE id\s*=\s*\?/i.test(cleanSql)) {
      const [status, id] = params;
      const { data, error } = await supabase.from('contacts').update({ status }).eq('id', id).select();
      if (error) throw error;
      return { changes: data ? data.length : 1 };
    }

    if (/DELETE FROM contacts WHERE id\s*=\s*\?/i.test(cleanSql)) {
      const id = params[0];
      const { data, error } = await supabase.from('contacts').delete().eq('id', id).select();
      if (error) throw error;
      return { changes: data ? data.length : 1 };
    }

    // ----------------- ORDERS QUERIES -----------------
    if (/FROM orders/i.test(cleanSql)) {
      const { data, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return type === 'get' ? (data && data[0] ? data[0] : null) : (data || []);
    }

    if (/INSERT INTO orders/i.test(cleanSql)) {
      const [
        customer_name,
        customer_phone,
        customer_email,
        dish_name,
        dish_price,
        booking_date,
        number_of_guests,
        delivery_address,
        special_requests
      ] = params;

      const { data, error } = await supabase.from('orders').insert([{
        customer_name,
        customer_phone,
        customer_email: customer_email || '',
        dish_name,
        dish_price,
        booking_date,
        number_of_guests: parseInt(number_of_guests, 10) || 1,
        delivery_address,
        special_requests: special_requests || ''
      }]).select();

      if (error) throw error;
      return { lastID: data && data[0] ? data[0].id : null, changes: data ? data.length : 1 };
    }

    if (/UPDATE orders SET status\s*=\s*\?\s*WHERE id\s*=\s*\?/i.test(cleanSql)) {
      const [status, id] = params;
      const { data, error } = await supabase.from('orders').update({ status }).eq('id', id).select();
      if (error) throw error;
      return { changes: data ? data.length : 1 };
    }

    if (/DELETE FROM orders WHERE id\s*=\s*\?/i.test(cleanSql)) {
      const id = params[0];
      const { data, error } = await supabase.from('orders').delete().eq('id', id).select();
      if (error) throw error;
      return { changes: data ? data.length : 1 };
    }

    console.warn('Unhandled Supabase SQL query:', cleanSql);
    return type === 'get' ? null : [];
  }

  db = {
    all(sql, params, callback) {
      if (typeof params === 'function') {
        callback = params;
        params = [];
      }
      executeSupabaseQuery('all', sql, params)
        .then(rows => {
          if (callback) callback(null, rows);
        })
        .catch(err => {
          console.error('Supabase DB all error:', err.message || err);
          if (callback) callback(err, []);
        });
    },

    get(sql, params, callback) {
      if (typeof params === 'function') {
        callback = params;
        params = [];
      }
      executeSupabaseQuery('get', sql, params)
        .then(row => {
          if (callback) callback(null, row);
        })
        .catch(err => {
          console.error('Supabase DB get error:', err.message || err);
          if (callback) callback(err, null);
        });
    },

    run(sql, params, callback) {
      if (typeof params === 'function') {
        callback = params;
        params = [];
      }
      executeSupabaseQuery('run', sql, params)
        .then(res => {
          const context = {
            lastID: res && res.lastID !== undefined ? res.lastID : null,
            changes: res && res.changes !== undefined ? res.changes : 1
          };
          if (callback) callback.call(context, null);
        })
        .catch(err => {
          console.error('Supabase DB run error:', err.message || err);
          if (callback) callback.call({ changes: 0 }, err);
        });
    },

    serialize(fn) {
      if (fn) fn();
    },

    close(callback) {
      if (callback) callback();
    }
  };

  // Check connection
  async function testSupabaseClientConnection() {
    try {
      const { data, error } = await supabase.from('users').select('id, username').limit(1);
      if (error) {
        console.error('❌ Supabase client test query error:', error.message);
      } else {
        console.log('🚀 Connected to Supabase via JavaScript Client successfully!');
      }
    } catch (err) {
      console.error('Supabase client connection check error:', err.message);
    }
  }

  testSupabaseClientConnection();

} else {
  console.error('❌ No Supabase credentials found! Please set SUPABASE_URL & SUPABASE_ANON_KEY (or DATABASE_URL) in .env');
  
  // Dummy db fallback to prevent server crash
  db = {
    all(sql, params, cb) { if (cb) cb(new Error('Supabase not configured in .env'), []); },
    get(sql, params, cb) { if (cb) cb(new Error('Supabase not configured in .env'), null); },
    run(sql, params, cb) { if (cb) cb.call({ changes: 0 }, new Error('Supabase not configured in .env')); },
    serialize(fn) { if (fn) fn(); },
    close(cb) { if (cb) cb(); }
  };
}

module.exports = db;