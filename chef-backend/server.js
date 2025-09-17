// chef-backend/server.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./database'); // Import the database

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); // Allows requests from your React frontend
app.use(express.json()); // Lets the server understand JSON data

// ==================== ROUTES ====================

// 1. TEST ROUTE - Check if server is working
app.get('/api', (req, res) => {
  res.json({ message: 'Welcome to Chef Srinivas Backend API!' });
});

// 2. GET ALL CONTACTS - For admin panel
app.get('/api/contacts', (req, res) => {
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

// 3. SEARCH CONTACTS - For search functionality
app.get('/api/contacts/search', (req, res) => {
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

// 4. SUBMIT CONTACT FORM - For website contact form
app.post('/api/contact', (req, res) => {
  try {
    const { name, email, message } = req.body;
    
    // Basic validation - check if all fields are filled
    if (!name || !email || !message) {
      return res.status(400).json({ 
        success: false, 
        message: 'All fields are required' 
      });
    }
    
    // Save to SQLite database
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
      console.log('👤 Name:', name);
      console.log('📧 Email:', email);
      console.log('💬 Message:', message);
      
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

// 5. UPDATE STATUS - Mark messages as read/unread
app.patch('/api/contacts/:id/status', (req, res) => {
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

// 6. DELETE CONTACT - Remove a message
app.delete('/api/contacts/:id', (req, res) => {
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

// ==================== START SERVER ====================
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 API URL: http://localhost:${PORT}/api`);
  console.log(`📧 Contact endpoint: http://localhost:${PORT}/api/contact`);
  console.log(`👥 Contacts list: http://localhost:${PORT}/api/contacts`);
  console.log(`🔍 Search: http://localhost:${PORT}/api/contacts/search?query=example`);
});