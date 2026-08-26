// src/Components/BookingModal.jsx - RESPONSIVE TOUCH-FRIENDLY BOOKING MODAL
import { useState, useEffect } from 'react';
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
  const [submitting, setSubmitting] = useState(false);

  // Close on Escape key & lock body scroll
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === 'phone') {
      const digitsOnly = value.replace(/\D/g, '').slice(0, 10);
      setFormData(prev => ({
        ...prev,
        phone: digitsOnly
      }));
      return;
    }

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!/^\d{10}$/.test(formData.phone)) {
      alert('❌ Please enter a valid 10-digit phone number.');
      return;
    }

    setSubmitting(true);
    try {
      const orderData = {
        customer_name: formData.name,
        customer_phone: formData.phone,
        customer_email: formData.email,
        dish_name: selectedItem?.name || 'Signature Dish',
        dish_price: selectedItem?.price || '₹0',
        booking_date: formData.date,
        number_of_guests: parseInt(formData.guests) || 1,
        delivery_address: formData.address,
        special_requests: formData.message
      };

      const response = await fetch('/api/orders', {
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
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button 
          className="close-button" 
          onClick={onClose}
          type="button"
          aria-label="Close booking modal"
        >
          &times;
        </button>
        
        <div className="modal-header">
          <h2>Book {selectedItem?.name || 'Selected Dish'}</h2>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <span className="modal-price">
              {selectedItem?.price || '₹150 / person'} • {selectedItem?.serves || 'All group sizes'}
            </span>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="booking-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="modal-name">Your Full Name *</label>
              <input
                id="modal-name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                placeholder="e.g. Rahul Sharma"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="modal-phone">Phone Number *</label>
              <input
                id="modal-phone"
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                required
                inputMode="tel"
                pattern="\d{10}"
                maxLength={10}
                placeholder="10-digit mobile number"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="modal-email">Email Address</label>
            <input
              id="modal-email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="name@example.com"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="modal-date">Preferred Event Date *</label>
              <input
                id="modal-date"
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                required
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="modal-guests">Number of Guests *</label>
              <input
                id="modal-guests"
                type="number"
                name="guests"
                value={formData.guests}
                onChange={handleInputChange}
                required
                min="1"
                max="1000"
                inputMode="numeric"
                placeholder="e.g. 50"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="modal-address">Delivery / Venue Address *</label>
            <textarea
              id="modal-address"
              name="address"
              rows="3"
              value={formData.address}
              onChange={handleInputChange}
              required
              placeholder="Enter complete venue or house address"
            />
          </div>

          <div className="form-group">
            <label htmlFor="modal-message">Special Requests or Dietary Restrictions</label>
            <textarea
              id="modal-message"
              name="message"
              rows="2"
              value={formData.message}
              onChange={handleInputChange}
              placeholder="Any allergies, spice level preference, or custom dish requests"
            />
          </div>

          <button 
            type="submit" 
            className="submit-booking-btn"
            disabled={submitting}
          >
            {submitting ? 'Submitting Order...' : '✅ Confirm & Book Experience'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default BookingModal;