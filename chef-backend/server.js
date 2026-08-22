// chef-backend/server.js - COMPLETE WORKING VERSION
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const path = require('path');
require('dotenv').config();
const db = require('./database');

// Import routes
const ordersRouter = require('./routes/orders');

const app = express();
const PORT = process.env.PORT || 5000;
const isProduction = process.env.NODE_ENV === 'production';

// Trust reverse proxy (necessary for Render / Cloud hosting)
app.set('trust proxy', 1);

// ==================== MIDDLEWARE ====================
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5000',
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin) || isProduction) {
      return callback(null, true);
    }
    return callback(null, true);
  },
  credentials: true,
}));

app.use(express.json());

app.use(session({
  secret: process.env.SESSION_SECRET || 'chef-srinivas-secret-key-2024',
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: isProduction, // Enabled in production behind HTTPS
    httpOnly: true, 
    sameSite: 'lax',
    maxAge: 24 * 60 * 60 * 1000
  }
}));

// ==================== AUTHENTICATION MIDDLEWARE ====================
const requireAuth = (req, res, next) => {
  if (req.session.isAuthenticated) {
    next();
  } else {
    res.status(401).json({ 
      success: false, 
      message: 'Authentication required' 
    });
  }
};

// ==================== AUTHENTICATION ROUTES ====================

// Login endpoint
app.post('/api/admin/login', (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Username and password are required' 
      });
    }
    
    db.get('SELECT id, username, password_hash FROM users WHERE username = ?', [username], (err, row) => {
      if (err) {
        console.error('DB error during login:', err);
        return res.status(500).json({ success: false, message: 'Internal server error' });
      }

      if (!row) {
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
      }

      bcrypt.compare(password, row.password_hash, (bcryptErr, match) => {
        if (bcryptErr) {
          console.error('Bcrypt error:', bcryptErr);
          return res.status(500).json({ success: false, message: 'Internal server error' });
        }

        if (!match) {
          return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        req.session.isAuthenticated = true;
        req.session.user = { username: row.username, id: row.id };
        console.log('🔐 Admin logged in successfully:', row.username);
        return res.status(200).json({ success: true, message: 'Login successful' });
      });
    });
    
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
});

// Logout endpoint
app.post('/api/admin/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Logout error:', err);
      return res.status(500).json({ 
        success: false, 
        message: 'Logout failed' 
      });
    }
    
    res.status(200).json({ 
      success: true, 
      message: 'Logout successful' 
    });
  });
});

// Check auth status
app.get('/api/admin/check-auth', (req, res) => {
  if (req.session.isAuthenticated) {
    res.status(200).json({ 
      success: true, 
      authenticated: true,
      user: req.session.user 
    });
  } else {
    res.status(200).json({ 
      success: true, 
      authenticated: false 
    });
  }
});

// Admin change-password endpoint (protected)
app.post('/api/admin/change-password', requireAuth, (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) {
      return res.status(400).json({ success: false, message: 'oldPassword and newPassword are required' });
    }

    const username = req.session.user && req.session.user.username;
    if (!username) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    db.get('SELECT id, password_hash FROM users WHERE username = ?', [username], (err, row) => {
      if (err) {
        console.error('DB error:', err);
        return res.status(500).json({ success: false, message: 'Internal server error' });
      }
      if (!row) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      bcrypt.compare(oldPassword, row.password_hash, (bcryptErr, match) => {
        if (bcryptErr) {
          console.error('Bcrypt error:', bcryptErr);
          return res.status(500).json({ success: false, message: 'Internal server error' });
        }
        if (!match) {
          return res.status(401).json({ success: false, message: 'Old password is incorrect' });
        }

        const saltRounds = 10;
        bcrypt.hash(newPassword, saltRounds, (hashErr, newHash) => {
          if (hashErr) {
            console.error('Hash error:', hashErr);
            return res.status(500).json({ success: false, message: 'Internal server error' });
          }

          db.run('UPDATE users SET password_hash = ? WHERE id = ?', [newHash, row.id], function(updateErr) {
            if (updateErr) {
              console.error('DB update error:', updateErr);
              return res.status(500).json({ success: false, message: 'Failed to update password' });
            }
            return res.status(200).json({ success: true, message: 'Password updated successfully' });
          });
        });
      });
    });

  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// ==================== API ROUTES ====================

// Test route
app.get('/api', (req, res) => {
  res.json({ message: 'Welcome to Chef Srinivas Backend API!' });
});

// GET ALL CONTACTS - For admin panel
app.get('/api/contacts', requireAuth, (req, res) => {
  const sql = `SELECT * FROM contacts ORDER BY created_at DESC`;
  
  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ 
        success: false, 
        message: 'Failed to fetch messages' 
      });
    }
    
    res.status(200).json({ 
      success: true, 
      contacts: rows 
    });
  });
});

// SEARCH CONTACTS
app.get('/api/contacts/search', requireAuth, (req, res) => {
  try {
    const { query } = req.query;
    
    if (!query) {
      return res.status(400).json({ 
        success: false, 
        message: 'Search query is required' 
      });
    }
    
    const sql = `SELECT * FROM contacts 
                 WHERE name LIKE ? OR email LIKE ? OR message LIKE ? 
                 ORDER BY created_at DESC`;
    const searchParam = `%${query}%`;
    
    db.all(sql, [searchParam, searchParam, searchParam], (err, rows) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ 
          success: false, 
          message: 'Failed to search messages' 
        });
      }
      
      res.status(200).json({ 
        success: true, 
        contacts: rows 
      });
    });
    
  } catch (error) {
    console.error('Error searching contacts:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
});

// SUBMIT CONTACT FORM
app.post('/api/contact', (req, res) => {
  try {
    const { name, email, message } = req.body;
    
    if (!name || !email || !message) {
      return res.status(400).json({ 
        success: false, 
        message: 'All fields are required' 
      });
    }
    
    const sql = `INSERT INTO contacts (name, email, message) VALUES (?, ?, ?)`;
    const params = [name, email, message];
    
    db.run(sql, params, function(err) {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ 
          success: false, 
          message: 'Failed to save message' 
        });
      }
      
      console.log('✅ Message saved to database with ID:', this.lastID);
      
      res.status(200).json({ 
        success: true, 
        message: 'Thank you! Chef Srinivas will contact you soon.',
        messageId: this.lastID
      });
    });
    
  } catch (error) {
    console.error('Error processing contact form:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
});

// UPDATE CONTACT STATUS
app.patch('/api/contacts/:id/status', requireAuth, (req, res) => {
  try {
    const contactId = req.params.id;
    const { status } = req.body;
    
    if (!['read', 'unread'].includes(status)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Status must be "read" or "unread"' 
      });
    }
    
    const sql = `UPDATE contacts SET status = ? WHERE id = ?`;
    
    db.run(sql, [status, contactId], function(err) {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ 
          success: false, 
          message: 'Failed to update status' 
        });
      }
      
      if (this.changes === 0) {
        return res.status(404).json({ 
          success: false, 
          message: 'Message not found' 
        });
      }
      
      console.log('📝 Message status updated:', contactId, '->', status);
      
      res.status(200).json({ 
        success: true, 
        message: 'Status updated successfully' 
      });
    });
    
  } catch (error) {
    console.error('Error updating status:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
});

// DELETE CONTACT
app.delete('/api/contacts/:id', requireAuth, (req, res) => {
  try {
    const contactId = req.params.id;
    
    const sql = `DELETE FROM contacts WHERE id = ?`;
    
    db.run(sql, [contactId], function(err) {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ 
          success: false, 
          message: 'Failed to delete message' 
        });
      }
      
      if (this.changes === 0) {
        return res.status(404).json({ 
          success: false, 
          message: 'Message not found' 
        });
      }
      
      console.log('🗑️ Message deleted with ID:', contactId);
      
      res.status(200).json({ 
        success: true, 
        message: 'Message deleted successfully' 
      });
    });
    
  } catch (error) {
    console.error('Error deleting contact:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
});

// ==================== USE ORDERS ROUTER ====================
app.use('/api/orders', ordersRouter);

// ==================== ADMIN HTML PAGES ====================

// ADMIN LOGIN PAGE
app.get('/admin', (req, res) => {
  const html = `
  <!DOCTYPE html>
  <html>
  <head>
    <title>Chef Srinivas - Admin Login</title>
    <style>
      body { 
        font-family: Arial, sans-serif; 
        margin: 0; 
        padding: 0; 
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        height: 100vh;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .login-container {
        background: white;
        padding: 40px;
        border-radius: 10px;
        box-shadow: 0 10px 25px rgba(0,0,0,0.2);
        width: 100%;
        max-width: 400px;
      }
      h1 { 
        color: #2c3e50; 
        text-align: center; 
        margin-bottom: 30px;
      }
      .form-group {
        margin-bottom: 20px;
      }
      label {
        display: block;
        margin-bottom: 5px;
        color: #555;
        font-weight: bold;
      }
      input {
        width: 100%;
        padding: 12px;
        border: 2px solid #ddd;
        border-radius: 5px;
        font-size: 16px;
        box-sizing: border-box;
      }
      input:focus {
        border-color: #667eea;
        outline: none;
      }
      .btn {
        width: 100%;
        padding: 12px;
        background: #667eea;
        color: white;
        border: none;
        border-radius: 5px;
        font-size: 16px;
        cursor: pointer;
        font-weight: bold;
      }
      .btn:hover {
        background: #764ba2;
      }
      .error {
        color: #e74c3c;
        text-align: center;
        margin-top: 10px;
        display: none;
      }
      .success {
        color: #27ae60;
        text-align: center;
        margin-top: 10px;
        display: none;
      }
      .forgot-password {
        text-align: center;
        margin-top: 12px;
      }
      .forgot-password a {
        color: #667eea;
        text-decoration: none;
        font-size: 14px;
      }
      .forgot-password a:hover {
        text-decoration: underline;
      }
      .demo-credentials {
        background: #f8f9fa;
        padding: 15px;
        border-radius: 5px;
        margin-top: 20px;
        font-size: 14px;
      }
    </style>
  </head>
  <body>
    <div class="login-container">
      <h1>🔐 Admin Login</h1>
      <form id="loginForm">
        <div class="form-group">
          <label for="username">Username:</label>
          <input type="text" id="username" name="username" required>
        </div>
        <div class="form-group">
          <label for="password">Password:</label>
          <input type="password" id="password" name="password" required>
        </div>
        <button type="submit" class="btn">Login</button>
        <div id="errorMessage" class="error"></div>
        <p class="forgot-password">
          <a href="/admin/forgot-password">Forgot your password?</a>
        </p>
      </form>
      <div class="demo-credentials">
        <strong>Demo Credentials:</strong><br>
        Username: admin<br>
        Password: Praveen@123
      </div>
    </div>

    <script>
      document.getElementById('loginForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const errorMessage = document.getElementById('errorMessage');
        errorMessage.style.display = 'none';
        
        try {
          const response = await fetch('/api/admin/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password })
          });
          
          const data = await response.json();
          
          if (data.success) {
            window.location.href = '/admin/orders';
          } else {
            errorMessage.textContent = data.message;
            errorMessage.style.display = 'block';
          }
        } catch (error) {
          errorMessage.textContent = 'Login failed. Please try again.';
          errorMessage.style.display = 'block';
        }
      });
    </script>
  </body>
  </html>
  `;
  
  res.send(html);
});

// ADMIN FORGOT PASSWORD PAGE
app.get('/admin/forgot-password', (req, res) => {
  const html = `
  <!DOCTYPE html>
  <html>
  <head>
    <title>Chef Srinivas - Reset Admin Password</title>
    <style>
      body { 
        font-family: Arial, sans-serif; 
        margin: 0; 
        padding: 0; 
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        height: 100vh;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .reset-container {
        background: white;
        padding: 40px;
        border-radius: 10px;
        box-shadow: 0 10px 25px rgba(0,0,0,0.2);
        width: 100%;
        max-width: 420px;
      }
      h1 { 
        color: #2c3e50; 
        text-align: center; 
        margin-bottom: 30px;
      }
      .form-group {
        margin-bottom: 20px;
      }
      label {
        display: block;
        margin-bottom: 5px;
        color: #555;
        font-weight: bold;
      }
      input {
        width: 100%;
        padding: 12px;
        border: 2px solid #ddd;
        border-radius: 5px;
        font-size: 16px;
        box-sizing: border-box;
      }
      input:focus {
        border-color: #667eea;
        outline: none;
      }
      .btn {
        width: 100%;
        padding: 12px;
        background: #667eea;
        color: white;
        border: none;
        border-radius: 5px;
        font-size: 16px;
        cursor: pointer;
        font-weight: bold;
      }
      .btn:hover {
        background: #764ba2;
      }
      .message {
        text-align: center;
        margin-top: 10px;
        display: none;
      }
      .message.error {
        color: #e74c3c;
      }
      .message.success {
        color: #27ae60;
      }
      .back-link {
        text-align: center;
        margin-top: 15px;
      }
      .back-link a {
        color: #667eea;
        text-decoration: none;
      }
      .back-link a:hover {
        text-decoration: underline;
      }
    </style>
  </head>
  <body>
    <div class="reset-container">
      <h1>🔑 Reset Password</h1>
      <form id="resetForm">
        <div class="form-group">
          <label for="username">Username:</label>
          <input type="text" id="username" name="username" required>
        </div>
        <div class="form-group">
          <label for="newPassword">New Password:</label>
          <input type="password" id="newPassword" name="newPassword" required>
        </div>
        <div class="form-group">
          <label for="confirmPassword">Confirm New Password:</label>
          <input type="password" id="confirmPassword" name="confirmPassword" required>
        </div>
        <button type="submit" class="btn">Reset Password</button>
        <div id="resetMessage" class="message"></div>
      </form>
      <div class="back-link">
        <a href="/admin">Back to Login</a>
      </div>
    </div>

    <script>
      document.getElementById('resetForm').addEventListener('submit', async (e) => {
        e.preventDefault();

        const username = document.getElementById('username').value;
        const newPassword = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const message = document.getElementById('resetMessage');

        message.style.display = 'none';
        message.classList.remove('error', 'success');

        if (newPassword !== confirmPassword) {
          message.textContent = 'New password and confirmation do not match.';
          message.classList.add('error');
          message.style.display = 'block';
          return;
        }

        try {
          const response = await fetch('/api/admin/reset-password', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, newPassword, confirmPassword })
          });

          const data = await response.json();

          if (data.success) {
            message.textContent = 'Password reset successfully. You can now log in.';
            message.classList.add('success');
            message.style.display = 'block';
          } else {
            message.textContent = data.message;
            message.classList.add('error');
            message.style.display = 'block';
          }
        } catch (error) {
          message.textContent = 'Password reset failed. Please try again.';
          message.classList.add('error');
          message.style.display = 'block';
        }
      });
    </script>
  </body>
  </html>
  `;

  res.send(html);
});

app.post('/api/admin/reset-password', (req, res) => {
  try {
    const { username, newPassword, confirmPassword } = req.body;

    if (!username || !newPassword || !confirmPassword) {
      return res.status(400).json({ success: false, message: 'Username, new password, and confirmation are required' });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ success: false, message: 'Passwords do not match' });
    }

    db.get('SELECT id FROM users WHERE username = ?', [username], (err, row) => {
      if (err) {
        console.error('DB error during password reset:', err);
        return res.status(500).json({ success: false, message: 'Internal server error' });
      }

      if (!row) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      bcrypt.hash(newPassword, 10, (hashErr, newHash) => {
        if (hashErr) {
          console.error('Hash error:', hashErr);
          return res.status(500).json({ success: false, message: 'Internal server error' });
        }

        db.run('UPDATE users SET password_hash = ? WHERE id = ?', [newHash, row.id], function(updateErr) {
          if (updateErr) {
            console.error('DB update error:', updateErr);
            return res.status(500).json({ success: false, message: 'Failed to update password' });
          }

          res.status(200).json({ success: true, message: 'Password has been reset successfully' });
        });
      });
    });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// ADMIN PANEL - HTML page to view and manage orders
app.get('/admin/orders', requireAuth, (req, res) => {
  const sql = `SELECT * FROM orders ORDER BY created_at DESC`;
  
  db.all(sql, [], (err, orders) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).send('Error fetching orders');
    }
    
    let html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Chef Srinivas - Order Management</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; background: #f5f5f5; }
        .container { max-width: 1400px; margin: 0 auto; background: white; padding: 20px; border-radius: 10px; }
        h1 { color: #2c3e50; text-align: center; }
        .order-actions { margin: 20px 0; text-align: center; }
        .btn { padding: 10px 15px; border: none; border-radius: 5px; cursor: pointer; margin: 5px; font-weight: bold; }
        .btn-confirm { background: #4caf50; color: white; }
        .btn-cancel { background: #f44336; color: white; }
        .btn-delete { background: #ff0000; color: white; }
        .status { padding: 5px 10px; border-radius: 3px; font-weight: bold; }
        .pending { background: #ff9800; color: white; }
        .confirmed { background: #4caf50; color: white; }
        .cancelled { background: #f44336; color: white; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
        th { background-color: #2c3e50; color: white; }
        .action-cell { display: flex; gap: 5px; }
        .details-row { display: none; }
        .details-row.show { display: table-row; }
        .details-content { padding: 15px; background: #f9f9f9; }
        .logout-btn {
          background: #e74c3c;
          color: white;
          padding: 10px 20px;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          font-weight: bold;
          margin-bottom: 20px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>🍽️ Chef Srinivas - Order Management</h1>
        <div style="text-align: center;">
          <button class="logout-btn" onclick="logout()">🚪 Logout</button>
        </div>
        <p>Total Orders: ${orders.length}</p>
    `;
    
    if (orders.length === 0) {
      html += `<p>No orders found.</p>`;
    } else {
      html += `
        <table>
          <tr>
            <th>Order ID</th>
            <th>Customer</th>
            <th>Phone</th>
            <th>Dish</th>
            <th>Date</th>
            <th>Guests</th>
            <th>Status</th>
            <th>Order Date</th>
            <th>Actions</th>
          </tr>
      `;
      
      orders.forEach(order => {
        html += `
          <tr>
            <td>${order.id}</td>
            <td>${order.customer_name}</td>
            <td>${order.customer_phone}</td>
            <td>${order.dish_name} (${order.dish_price})</td>
            <td>${order.booking_date}</td>
            <td>${order.number_of_guests}</td>
            <td><span class="status ${order.status}">${order.status}</span></td>
            <td>${new Date(order.created_at).toLocaleString()}</td>
            <td class="action-cell">
              ${order.status !== 'confirmed' ? 
                `<button class="btn btn-confirm" onclick="updateOrderStatus(${order.id}, 'confirmed')">Confirm</button>` : ''}
              ${order.status !== 'cancelled' ? 
                `<button class="btn btn-cancel" onclick="updateOrderStatus(${order.id}, 'cancelled')">Cancel</button>` : ''}
              <button class="btn btn-delete" onclick="deleteOrder(${order.id})">Delete</button>
              <button onclick="toggleDetails(${order.id})">Details</button>
            </td>
          </tr>
          <tr id="details-${order.id}" class="details-row">
            <td colspan="9" class="details-content">
              <strong>Email:</strong> ${order.customer_email || 'N/A'}<br>
              <strong>Delivery Address:</strong> ${order.delivery_address}<br>
              <strong>Special Requests:</strong> ${order.special_requests || 'None'}<br>
              <strong>Created:</strong> ${new Date(order.created_at).toLocaleString()}
            </td>
          </tr>
        `;
      });
      
      html += `</table>`;
    }
    
    html += `
      </div>
      
      <script>
        function toggleDetails(orderId) {
          const row = document.getElementById('details-' + orderId);
          row.classList.toggle('show');
        }
        
        function updateOrderStatus(orderId, status) {
          if (!confirm('Are you sure you want to ' + status + ' this order?')) {
            return;
          }
          
          fetch('/api/orders/' + orderId + '/status', {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ status: status })
          })
          .then(response => response.json())
          .then(data => {
            if (data.success) {
              alert('Order ' + status + ' successfully!');
              location.reload();
            } else {
              alert('Error: ' + data.message);
            }
          })
          .catch(error => {
            alert('Error updating order status');
          });
        }
        
        function deleteOrder(orderId) {
          if (!confirm('Are you sure you want to delete this order? This cannot be undone.')) {
            return;
          }
          
          fetch('/api/orders/' + orderId, {
            method: 'DELETE'
          })
          .then(response => response.json())
          .then(data => {
            if (data.success) {
              alert('Order deleted successfully!');
              location.reload();
            } else {
              alert('Error: ' + data.message);
            }
          })
          .catch(error => {
            alert('Error deleting order');
          });
        }
        
        function logout() {
          if (confirm('Are you sure you want to logout?')) {
            fetch('/api/admin/logout', {
              method: 'POST'
            })
            .then(response => response.json())
            .then(data => {
              if (data.success) {
                window.location.href = '/admin';
              }
            });
          }
        }
        
        // Check authentication on page load
        fetch('/api/admin/check-auth')
          .then(response => response.json())
          .then(data => {
            if (!data.authenticated) {
              window.location.href = '/admin';
            }
          });
      </script>
    </body>
    </html>
    `;
    
    res.send(html);
  });
});

// ==================== SERVE STATIC FRONTEND (PRODUCTION / BUILD) ====================
const distPath = path.join(__dirname, '../dist');
app.use(express.static(distPath));

// Fallback to serve React Single Page Application (SPA) for any unhandled GET requests
app.use((req, res, next) => {
  if (req.method === 'GET' && !req.path.startsWith('/api') && !req.path.startsWith('/admin/orders') && !req.path.startsWith('/admin/forgot-password')) {
    const indexPath = path.join(distPath, 'index.html');
    return res.sendFile(indexPath, (err) => {
      if (err) {
        next();
      }
    });
  }
  next();
});

// ==================== START SERVER ====================
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 API URL: http://localhost:${PORT}/api`);
  console.log(`📧 Contact endpoint: http://localhost:${PORT}/api/contact`);
  console.log(`👥 Contacts list: http://localhost:${PORT}/api/contacts`);
  console.log(`🔍 Search: http://localhost:${PORT}/api/contacts/search?query=example`);
  console.log(`🍽️ Orders endpoint: http://localhost:${PORT}/api/orders`);
  console.log(`👨‍🍳 Admin login: http://localhost:${PORT}/admin`);
  console.log(`📋 Admin orders page: http://localhost:${PORT}/admin/orders`);
});