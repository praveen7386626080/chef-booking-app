import React, { useState } from 'react';

function Contact() {
  // Chef-inspired color themes (same as About component)
  const themes = {
    chefGold: {
      background: 'linear-gradient(135deg, #fff9db 0%, #ffec99 50%, #fcc419 100%)',
      primary: '#d6336c',
      secondary: '#e67700', 
      accent: '#5c940d',
      textDark: '#2b2d42',
      textLight: '#495057',
      cardBg: '#fff9db',
      border: '#ffd8a8'
    }
  };

  const theme = themes.chefGold;
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', eventType: '', date: '', message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'phone') {
      const digitsOnly = value.replace(/\D/g, '').slice(0, 10);
      setFormData({ ...formData, phone: digitsOnly });
      return;
    }

    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!/^\d{10}$/.test(formData.phone)) {
      alert('Please enter a valid 10-digit phone number.');
      return;
    }

    if (!formData.message.trim()) {
      alert('Please enter your message before sending.');
      return;
    }

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          message: formData.message
        })
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        alert(data.message || 'Failed to send message. Please try again.');
        return;
      }

      alert(data.message || 'Thank you for your message! Chef Srinivas will get back to you soon.');
      setFormData({ name: '', email: '', phone: '', eventType: '', date: '', message: '' });
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Network error while sending message. Please try again later.');
    }
  };

  return (
    <section 
      className="contact py-16 px-4" 
      id="contact"
      style={{
        background: theme.background,
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center'
      }}
    >
      <div className="max-w-6xl mx-auto" style={{width: '100%'}}>
        
        {/* Header Section - Same as About */}
        <div style={{textAlign: 'center', marginBottom: '3rem'}}>
          <h2 style={{
            fontSize: '2.5rem',
            fontWeight: 'bold',
            color: theme.textDark,
            marginBottom: '1rem'
          }}>
            Get In Touch With Chef Srinivas
          </h2>
          <div style={{
            width: '96px',
            height: '4px',
            backgroundColor: theme.secondary,
            margin: '0 auto 1.5rem auto',
            borderRadius: '2px'
          }}></div>
          <p style={{
            fontSize: '1.2rem',
            color: theme.textLight,
            maxWidth: '600px',
            margin: '0 auto',
            lineHeight: '1.6'
          }}>
            Ready to create an unforgettable dining experience? Let's discuss your event!
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '2rem',
          alignItems: 'start'
        }}>
          
          {/* Contact Form */}
          <div style={{
            backgroundColor: theme.cardBg,
            borderRadius: '1rem',
            boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
            padding: '2rem',
            border: `2px solid ${theme.border}`
          }}>
            <h3 style={{
              fontSize: '1.8rem',
              fontWeight: 'bold',
              color: theme.textDark,
              marginBottom: '1.5rem',
              textAlign: 'center'
            }}>
              Send a Message
            </h3>
            
            <form onSubmit={handleSubmit} style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  color: theme.textDark,
                  marginBottom: '0.5rem'
                }}>Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: `2px solid ${theme.border}`,
                    borderRadius: '0.5rem',
                    fontSize: '1rem',
                    backgroundColor: 'white',
                    outline: 'none',
                    transition: 'border-color 0.3s'
                  }}
                  onFocus={(e) => e.target.style.borderColor = theme.primary}
                  onBlur={(e) => e.target.style.borderColor = theme.border}
                  placeholder="Your full name"
                />
              </div>

              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'}}>
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    color: theme.textDark,
                    marginBottom: '0.5rem'
                  }}>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: `2px solid ${theme.border}`,
                      borderRadius: '0.5rem',
                      fontSize: '1rem',
                      backgroundColor: 'white'
                    }}
                    placeholder="your@email.com"
                  />
                </div>
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    color: theme.textDark,
                    marginBottom: '0.5rem'
                  }}>Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    inputMode="numeric"
                    pattern="\d{10}"
                    maxLength={10}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: `2px solid ${theme.border}`,
                      borderRadius: '0.5rem',
                      fontSize: '1rem',
                      backgroundColor: 'white'
                    }}
                    placeholder="Enter 10-digit phone number"
                  />
                </div>
              </div>

              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'}}>
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    color: theme.textDark,
                    marginBottom: '0.5rem'
                  }}>Event Type</label>
                  <select
                    name="eventType"
                    value={formData.eventType}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: `2px solid ${theme.border}`,
                      borderRadius: '0.5rem',
                      fontSize: '1rem',
                      backgroundColor: 'white'
                    }}
                  >
                    <option value="">Select event type</option>
                    <option value="wedding">Wedding</option>
                    <option value="birthday">Birthday Party</option>
                    <option value="corporate">Corporate Event</option>
                    <option value="anniversary">Anniversary</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    color: theme.textDark,
                    marginBottom: '0.5rem'
                  }}>Event Date</label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: `2px solid ${theme.border}`,
                      borderRadius: '0.5rem',
                      fontSize: '1rem',
                      backgroundColor: 'white'
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  color: theme.textDark,
                  marginBottom: '0.5rem'
                }}>Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="4"
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: `2px solid ${theme.border}`,
                    borderRadius: '0.5rem',
                    fontSize: '1rem',
                    backgroundColor: 'white',
                    resize: 'vertical'
                  }}
                  placeholder="Tell us about your event requirements..."
                ></textarea>
              </div>

              <button
                type="submit"
                style={{
                  width: '100%',
                  padding: '1rem',
                  backgroundColor: theme.primary,
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.5rem',
                  fontSize: '1.1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'background-color 0.3s'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#c2255c'}
                onMouseLeave={(e) => e.target.style.backgroundColor = theme.primary}
              >
                Send Message to Chef
              </button>
            </form>
          </div>

          {/* Contact Information */}
          <div style={{display: 'flex', flexDirection: 'column', gap: '1.5rem'}}>
            <div style={{
              backgroundColor: theme.cardBg,
              borderRadius: '1rem',
              boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
              padding: '2rem',
              border: `2px solid ${theme.border}`
            }}>
              <h3 style={{
                fontSize: '1.5rem',
                fontWeight: 'bold',
                color: theme.textDark,
                marginBottom: '1.5rem',
                textAlign: 'center'
              }}>
                Contact Information
              </h3>
              
              <div style={{display: 'flex', flexDirection: 'column', gap: '1.5rem'}}>
                {[
                  { icon: '📞', label: 'Phone', value: '+91 98765 43210' },
                  { icon: '📧', label: 'Email', value: 'chef.srinivas@email.com' },
                  { icon: '📍', label: 'Address', value: '123 Culinary Street, Food City, 560001' },
                  { icon: '⏰', label: 'Response Time', value: 'Within 2 hours' }
                ].map((item, index) => (
                  <div key={index} style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
                    <div style={{
                      width: '50px',
                      height: '50px',
                      backgroundColor: theme.secondary,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.5rem'
                    }}>
                      {item.icon}
                    </div>
                    <div>
                      <p style={{
                        fontWeight: '600',
                        color: theme.textDark,
                        margin: '0 0 0.25rem 0'
                      }}>{item.label}</p>
                      <p style={{
                        color: theme.primary,
                        margin: 0,
                        fontWeight: '500'
                      }}>{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Chef's Special Note */}
            <div style={{
              backgroundColor: theme.primary,
              color: 'white',
              borderRadius: '1rem',
              padding: '1.5rem',
              textAlign: 'center'
            }}>
              <h4 style={{
                fontSize: '1.2rem',
                fontWeight: 'bold',
                marginBottom: '0.5rem'
              }}>Chef's Promise</h4>
              <p style={{margin: 0, fontStyle: 'italic'}}>
                "I personally oversee every event and guarantee a dining experience 
                that will leave your guests talking for weeks!"
              </p>
              <p style={{margin: '0.5rem 0 0 0', fontWeight: '600'}}>
                - Chef Srinivas
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Contact;