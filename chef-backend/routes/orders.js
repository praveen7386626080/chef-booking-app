// backend/routes/orders.js - FIXED VERSION
const express = require('express');
const router = express.Router();
const db = require('../database'); // FIXED: Changed from '../config/database' to '../database'

// Get all orders (for admin)
router.get('/', async (req, res) => {
  try {
    const sql = `SELECT * FROM orders ORDER BY created_at DESC`;
    
    db.all(sql, [], (err, orders) => {
      if (err) {
        console.error('Database error fetching orders:', err);
        return res.status(500).json({ 
          success: false, 
          message: 'Failed to fetch orders' 
        });
      }
      
      console.log(`📦 Fetched ${orders.length} orders from database`);
      res.status(200).json({ 
        success: true, 
        orders: orders 
      });
    });
  } catch (error) {
    console.error('Error in orders route:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

// Create new order (for customers)
router.post('/', async (req, res) => {
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

    // Validation
    if (!customer_name || !customer_phone || !dish_name || !dish_price || !booking_date || !number_of_guests || !delivery_address) {
      return res.status(400).json({ 
        success: false, 
        message: 'All required fields must be filled' 
      });
    }

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

// Update order status (for admin)
router.patch('/:id/status', async (req, res) => {
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

// Delete order (for admin)
router.delete('/:id', async (req, res) => {
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

module.exports = router;