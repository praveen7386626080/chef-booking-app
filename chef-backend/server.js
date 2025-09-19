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

// 7. ORDER SUBMISSION ENDPOINT
app.post('/api/orders', (req, res) => {
  try {
    console.log('📦 Received order request:', JSON.stringify(req.body, null, 2));
    
    const {
      customer_name,
      customer_phone,
      customer_email,
      dish_name,
      dish_price,
      booking_date,
      number_of_guests,
      delivery_address,
      special_requests
    } = req.body;

    // Enhanced validation with detailed logging
    const requiredFields = {
      customer_name,
      customer_phone,
      dish_name,
      dish_price,
      booking_date,
      number_of_guests,
      delivery_address
    };

    console.log('🔍 Field validation:');
    for (const [field, value] of Object.entries(requiredFields)) {
      console.log(`   ${field}: ${value} (${typeof value}) - Valid: ${!!value}`);
    }

    // Check if any required field is empty
    const missingFields = Object.entries(requiredFields)
      .filter(([field, value]) => !value)
      .map(([field]) => field);

    if (missingFields.length > 0) {
      console.log('❌ Missing fields:', missingFields);
      return res.status(400).json({ 
        success: false, 
        message: 'All required fields must be filled',
        missingFields: missingFields
      });
    }

    // Validate number of guests
    if (number_of_guests < 1 || number_of_guests > 1000) {
      return res.status(400).json({ 
        success: false, 
        message: 'Number of guests must be between 1 and 1000' 
      });
    }

    // Validate date is not in the past
    const bookingDate = new Date(booking_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (bookingDate < today) {
      return res.status(400).json({ 
        success: false, 
        message: 'Booking date cannot be in the past' 
      });
    }

    // Save order to database
    const sql = `INSERT INTO orders 
                 (customer_name, customer_phone, customer_email, dish_name, dish_price, booking_date, number_of_guests, delivery_address, special_requests) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    
    const params = [
      customer_name,
      customer_phone,
      customer_email || '',
      dish_name,
      dish_price,
      booking_date,
      number_of_guests,
      delivery_address,
      special_requests || ''
    ];

    db.run(sql, params, function(err) {
      if (err) {
        console.error('❌ Database error saving order:', err);
        return res.status(500).json({ 
          success: false, 
          message: 'Failed to save order' 
        });
      }

      console.log('✅ New order saved with ID:', this.lastID);
      console.log('👤 Customer:', customer_name);
      console.log('📞 Phone:', customer_phone);
      console.log('🍽️ Dish:', dish_name);
      console.log('💰 Price:', dish_price);
      console.log('📅 Date:', booking_date);
      console.log('👥 Guests:', number_of_guests);

      res.status(200).json({ 
        success: true, 
        message: 'Order placed successfully! Chef Srinivas will contact you to confirm.',
        orderId: this.lastID
      });
    });

  } catch (error) {
    console.error('❌ Error processing order:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
});

// 8. GET ALL ORDERS ENDPOINT (for admin)
app.get('/api/orders', (req, res) => {
  const sql = `SELECT * FROM orders ORDER BY created_at DESC`;
  
  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error('Database error fetching orders:', err);
      return res.status(500).json({ 
        success: false, 
        message: 'Failed to fetch orders' 
      });
    }
    
    res.status(200).json({ 
      success: true, 
      orders: rows 
    });
  });
});

// 9. UPDATE ORDER STATUS (for admin)
app.patch('/api/orders/:id/status', (req, res) => {
  try {
    const orderId = req.params.id;
    const { status } = req.body;
    
    if (!['pending', 'confirmed', 'cancelled'].includes(status)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Status must be "pending", "confirmed", or "cancelled"' 
      });
    }
    
    const sql = `UPDATE orders SET status = ? WHERE id = ?`;
    
    db.run(sql, [status, orderId], function(err) {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ 
          success: false, 
          message: 'Failed to update order status' 
        });
      }
      
      if (this.changes === 0) {
        return res.status(404).json({ 
          success: false, 
          message: 'Order not found' 
        });
      }
      
      console.log('📝 Order status updated:', orderId, '->', status);
      
      res.status(200).json({ 
        success: true, 
        message: 'Order status updated successfully' 
      });
    });
    
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
});

// 10. DELETE ORDER ENDPOINT (for admin)
app.delete('/api/orders/:id', (req, res) => {
  try {
    const orderId = req.params.id;
    
    const sql = `DELETE FROM orders WHERE id = ?`;
    
    db.run(sql, [orderId], function(err) {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ 
          success: false, 
          message: 'Failed to delete order' 
        });
      }
      
      if (this.changes === 0) {
        return res.status(404).json({ 
          success: false, 
          message: 'Order not found' 
        });
      }
      
      console.log('🗑️ Order deleted with ID:', orderId);
      
      res.status(200).json({ 
        success: true, 
        message: 'Order deleted successfully' 
      });
    });
    
  } catch (error) {
    console.error('Error deleting order:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
});

// 11. ADMIN PANEL - HTML page to view and manage orders
app.get('/admin/orders', (req, res) => {
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
      </style>
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
      </script>
    </head>
    <body>
      <div class="container">
        <h1>🍽️ Chef Srinivas - Order Management</h1>
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
    </body>
    </html>
    `;
    
    res.send(html);
  });
});

// ==================== START SERVER ====================
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 API URL: http://localhost:${PORT}/api`);
  console.log(`📧 Contact endpoint: http://localhost:${PORT}/api/contact`);
  console.log(`👥 Contacts list: http://localhost:${PORT}/api/contacts`);
  console.log(`🔍 Search: http://localhost:${PORT}/api/contacts/search?query=example`);
  console.log(`🍽️ Orders endpoint: http://localhost:${PORT}/api/orders`);
  console.log(`👨‍🍳 Admin orders page: http://localhost:${PORT}/admin/orders`);
  console.log(`🛠️ Order status API: http://localhost:${PORT}/api/orders/:id/status`);
  console.log(`🗑️ Delete order API: http://localhost:${PORT}/api/orders/:id`);
});