// src/Components/Contact.jsx - RESPONSIVE TOUCH-OPTIMIZED CONTACT FORM
import React, { useState } from 'react';

function Contact() {
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', eventType: '', date: '', message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'phone') {
      const digitsOnly = value.replace(/\D/g, '').slice(0, 10);
      setFormData(prev => ({ ...prev, phone: digitsOnly }));
      return;
    }

    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!/^\d{10}$/.test(formData.phone)) {
      alert('❌ Please enter a valid 10-digit phone number.');
      return;
    }

    if (!formData.message.trim()) {
      alert('❌ Please enter your event requirements or message.');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          message: `[Event: ${formData.eventType || 'Not specified'} | Date: ${formData.date || 'Flexible'} | Phone: ${formData.phone}] - ${formData.message}`
        })
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        alert(data.message || '❌ Failed to send message. Please try again.');
        return;
      }

      alert('✅ ' + (data.message || 'Thank you for your message! Chef Srinivas will get back to you shortly.'));
      setFormData({ name: '', email: '', phone: '', eventType: '', date: '', message: '' });
    } catch (error) {
      console.error('Error sending message:', error);
      alert('❌ Network error while sending message. Please check your connection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="contact-section" id="contact">
      <div style={{ maxWidth: '1150px', margin: '0 auto', width: '100%' }}>
        
        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h2 style={{
            fontSize: 'clamp(2rem, 5vw, 2.75rem)',
            fontWeight: '800',
            color: '#2b2d42',
            marginBottom: '0.75rem',
            letterSpacing: '-0.02em'
          }}>
            Get In Touch With Chef Srinivas
          </h2>
          <div style={{
            width: '80px',
            height: '4px',
            backgroundColor: '#e67700',
            margin: '0 auto 1.25rem',
            borderRadius: '2px'
          }}></div>
          <p style={{
            fontSize: 'clamp(1rem, 2.5vw, 1.15rem)',
            color: '#495057',
            maxWidth: '620px',
            margin: '0 auto',
            lineHeight: '1.6'
          }}>
            Ready to organize an unforgettable dining event? Tell us about your date, venue, and vision!
          </p>
        </div>

        {/* Contact Layout Grid */}
        <div className="contact-layout-grid">
          
          {/* Contact Form */}
          <div className="contact-card-box">
            <h3 style={{
              fontSize: '1.5rem',
              fontWeight: '700',
              color: '#2b2d42',
              marginBottom: '1.25rem',
              textAlign: 'center'
            }}>
              Send an Inquiry
            </h3>
            
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: '#2b2d42',
                  marginBottom: '0.35rem'
                }}>Your Full Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Priya Sundaram"
                  style={{
                    width: '100%',
                    padding: '0.75rem 0.9rem',
                    border: '1.5px solid #ffd8a8',
                    borderRadius: '0.5rem',
                    fontSize: '16px',
                    backgroundColor: '#ffffff',
                    outline: 'none',
                    transition: 'border-color 0.2s'
                  }}
                />
              </div>

              {/* Responsive Row: Email & Phone */}
              <div className="form-responsive-row">
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    color: '#2b2d42',
                    marginBottom: '0.35rem'
                  }}>Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="priya@example.com"
                    style={{
                      width: '100%',
                      padding: '0.75rem 0.9rem',
                      border: '1.5px solid #ffd8a8',
                      borderRadius: '0.5rem',
                      fontSize: '16px',
                      backgroundColor: '#ffffff',
                      outline: 'none'
                    }}
                  />
                </div>
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    color: '#2b2d42',
                    marginBottom: '0.35rem'
                  }}>Mobile Phone *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    inputMode="tel"
                    pattern="\d{10}"
                    maxLength={10}
                    placeholder="10-digit number"
                    style={{
                      width: '100%',
                      padding: '0.75rem 0.9rem',
                      border: '1.5px solid #ffd8a8',
                      borderRadius: '0.5rem',
                      fontSize: '16px',
                      backgroundColor: '#ffffff',
                      outline: 'none'
                    }}
                  />
                </div>
              </div>

              {/* Responsive Row: Event Type & Date */}
              <div className="form-responsive-row">
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    color: '#2b2d42',
                    marginBottom: '0.35rem'
                  }}>Event Type</label>
                  <select
                    name="eventType"
                    value={formData.eventType}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '0.75rem 0.9rem',
                      border: '1.5px solid #ffd8a8',
                      borderRadius: '0.5rem',
                      fontSize: '16px',
                      backgroundColor: '#ffffff',
                      outline: 'none'
                    }}
                  >
                    <option value="">Select Event Type</option>
                    <option value="Wedding / Reception">Wedding / Reception</option>
                    <option value="Birthday Party">Birthday Party</option>
                    <option value="Corporate Dinner">Corporate Dinner</option>
                    <option value="Anniversary Celebration">Anniversary Celebration</option>
                    <option value="Private Home Dining">Private Home Dining</option>
                    <option value="Other Celebration">Other Celebration</option>
                  </select>
                </div>
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    color: '#2b2d42',
                    marginBottom: '0.35rem'
                  }}>Target Date</label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    min={new Date().toISOString().split('T')[0]}
                    style={{
                      width: '100%',
                      padding: '0.75rem 0.9rem',
                      border: '1.5px solid #ffd8a8',
                      borderRadius: '0.5rem',
                      fontSize: '16px',
                      backgroundColor: '#ffffff',
                      outline: 'none'
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: '#2b2d42',
                  marginBottom: '0.35rem'
                }}>Your Requirements / Message *</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="3"
                  required
                  placeholder="Tell us about expected guest count, favorite dishes, venue location, or dietary preferences..."
                  style={{
                    width: '100%',
                    padding: '0.75rem 0.9rem',
                    border: '1.5px solid #ffd8a8',
                    borderRadius: '0.5rem',
                    fontSize: '16px',
                    backgroundColor: '#ffffff',
                    resize: 'vertical',
                    outline: 'none'
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                style={{
                  width: '100%',
                  padding: '0.95rem 1.5rem',
                  backgroundColor: '#d6336c',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '0.5rem',
                  fontSize: '1.1rem',
                  fontWeight: '700',
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  transition: 'background-color 0.2s',
                  minHeight: '48px',
                  boxShadow: '0 4px 12px rgba(214, 51, 108, 0.3)'
                }}
              >
                {isSubmitting ? 'Sending Message...' : '📨 Send Message to Chef Srinivas'}
              </button>
            </form>
          </div>

          {/* Contact Details & Chef Note */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="contact-card-box">
              <h3 style={{
                fontSize: '1.4rem',
                fontWeight: '700',
                color: '#2b2d42',
                marginBottom: '1.25rem',
                textAlign: 'center'
              }}>
                Direct Contact
              </h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <a href="tel:+919876543210" className="contact-info-link">
                  <div style={{
                    width: '46px',
                    height: '46px',
                    backgroundColor: '#e67700',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.3rem',
                    flexShrink: 0
                  }}>
                    📞
                  </div>
                  <div>
                    <p style={{ fontWeight: '600', color: '#2b2d42', margin: '0 0 2px 0', fontSize: '0.85rem' }}>Tap to Call</p>
                    <p style={{ color: '#d6336c', margin: 0, fontWeight: '700', fontSize: '1rem' }}>+91 98765 43210</p>
                  </div>
                </a>

                <a href="mailto:chef.srinivas@email.com" className="contact-info-link">
                  <div style={{
                    width: '46px',
                    height: '46px',
                    backgroundColor: '#e67700',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.3rem',
                    flexShrink: 0
                  }}>
                    📧
                  </div>
                  <div>
                    <p style={{ fontWeight: '600', color: '#2b2d42', margin: '0 0 2px 0', fontSize: '0.85rem' }}>Email Inquiries</p>
                    <p style={{ color: '#d6336c', margin: 0, fontWeight: '600', fontSize: '0.95rem', wordBreak: 'break-all' }}>chef.srinivas@email.com</p>
                  </div>
                </a>

                <div className="contact-info-link" style={{ cursor: 'default' }}>
                  <div style={{
                    width: '46px',
                    height: '46px',
                    backgroundColor: '#e67700',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.3rem',
                    flexShrink: 0
                  }}>
                    📍
                  </div>
                  <div>
                    <p style={{ fontWeight: '600', color: '#2b2d42', margin: '0 0 2px 0', fontSize: '0.85rem' }}>Catering Coverage</p>
                    <p style={{ color: '#2b2d42', margin: 0, fontSize: '0.95rem' }}>Serving Metro & Surrounding Areas</p>
                  </div>
                </div>

                <div className="contact-info-link" style={{ cursor: 'default' }}>
                  <div style={{
                    width: '46px',
                    height: '46px',
                    backgroundColor: '#e67700',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.3rem',
                    flexShrink: 0
                  }}>
                    ⏰
                  </div>
                  <div>
                    <p style={{ fontWeight: '600', color: '#2b2d42', margin: '0 0 2px 0', fontSize: '0.85rem' }}>Response Time</p>
                    <p style={{ color: '#5c940d', margin: 0, fontWeight: '700', fontSize: '0.95rem' }}>Usually within 2 hours</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Chef's Promise */}
            <div style={{
              backgroundColor: '#d6336c',
              color: '#ffffff',
              borderRadius: 'var(--radius-lg)',
              padding: '1.35rem',
              textAlign: 'center',
              boxShadow: 'var(--shadow-md)'
            }}>
              <h4 style={{
                fontSize: '1.15rem',
                fontWeight: '700',
                marginBottom: '0.35rem'
              }}>Chef Srinivas's Promise</h4>
              <p style={{ margin: 0, fontStyle: 'italic', fontSize: '0.92rem', opacity: 0.95, lineHeight: 1.5 }}>
                "I personally oversee every menu and guarantee an authentic dining experience that your guests will cherish!"
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Contact;