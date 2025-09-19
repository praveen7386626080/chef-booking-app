// src/components/BookingModal.jsx
import { useState } from 'react';
import './BookingModal.css';

function BookingModal({ isOpen, onClose, selectedItem }) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    date: '',
    guests: '2',
    address: '',
    message: ''
  });

  if (!isOpen) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // REMOVE the selectedItem validation that's causing the error
    // if (!selectedItem || !selectedItem.name || !selectedItem.price) {
    //   alert('❌ No dish selected. Please try again.');
    //   return;
    // }
    
    try {
      const orderData = {
        customer_name: formData.name,
        customer_phone: formData.phone,
        customer_email: formData.email,
        dish_name: selectedItem?.name || 'Unknown Dish', // Add fallback
        dish_price: selectedItem?.price || '0', // Add fallback
        booking_date: formData.date,
        number_of_guests: parseInt(formData.guests) || 1,
        delivery_address: formData.address,
        special_requests: formData.message
      };

      const response = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      const data = await response.json();

      if (data.success) {
        alert(`✅ ${data.message}\nYour Order ID: ${data.orderId}`);
        onClose();
      } else {
        if (data.missingFields) {
          alert(`❌ Please fill in: ${data.missingFields.join(', ').replace(/_/g, ' ')}`);
        } else {
          alert('❌ Failed to place order: ' + data.message);
        }
      }

    } catch (error) {
      console.error('Error submitting order:', error);
      alert('❌ Network error. Please check if the server is running.');
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>×</button>
        
        {/* Add fallbacks for undefined values */}
        <h2>Book {selectedItem?.name || 'Selected Dish'}</h2>
        <p className="modal-price">{selectedItem?.price || 'N/A'} • {selectedItem?.serves || ''}</p>
        
        <form onSubmit={handleSubmit} className="booking-form">
          <div className="form-row">
            <div className="form-group">
              <label>Your Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label>Phone Number *</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Preferred Date *</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                required
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
            
            <div className="form-group">
              <label>Number of Guests *</label>
              <input
                type="number"
                name="guests"
                value={formData.guests}
                onChange={handleInputChange}
                required
                min="1"
                max="1000"
                placeholder="Enter number of guests"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Delivery Address *</label>
            <textarea
              name="address"
              rows="3"
              value={formData.address}
              onChange={handleInputChange}
              required
              placeholder="Enter your complete address"
            />
          </div>

          <div className="form-group">
            <label>Special Requests</label>
            <textarea
              name="message"
              rows="3"
              value={formData.message}
              onChange={handleInputChange}
              placeholder="Any allergies, dietary restrictions, or special instructions"
            />
          </div>

          <button type="submit" className="submit-booking-btn">
            Confirm Booking
          </button>
        </form>
      </div>
    </div>
  );
}

export default BookingModal;