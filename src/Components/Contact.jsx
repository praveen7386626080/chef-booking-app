// src/components/Contact.jsx
import { useState } from 'react';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage('');
    
    try {
      // This is the crucial line - connecting to your backend!
      const response = await fetch('http://localhost:5000/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setSubmitMessage(data.message);
        setFormData({ name: '', email: '', message: '' });
      } else {
        setSubmitMessage(data.message || 'Sorry, there was an error sending your message.');
      }
    } catch (error) {
      console.error('Error:', error);
      setSubmitMessage('Network error. Please check if the server is running.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="contact" id="contact">
      <h2>Get In Touch</h2>
      <div className="contact-content">
        <div className="contact-info">
          <h3>Contact Information</h3>
          <p>
            <strong>Email:</strong> srinivas@chefkitchen.com<br />
            <strong>Phone:</strong> +91 9XXXXXXXXX<br />
            <strong>Location:</strong> Serving Hyderabad and surrounding areas
          </p>
        </div>
        
        <form className="contact-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Your Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              disabled={isSubmitting}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="email">Your Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              disabled={isSubmitting}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="message">Your Message</label>
            <textarea
              id="message"
              name="message"
              rows="5"
              value={formData.message}
              onChange={handleInputChange}
              required
              disabled={isSubmitting}
            ></textarea>
          </div>
          
          <button 
            type="submit" 
            className="submit-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Sending...' : 'Send Message'}
          </button>
          
          {submitMessage && (
            <div className={`submit-message ${submitMessage.includes('error') ? 'error' : 'success'}`}>
              {submitMessage}
            </div>
          )}
        </form>
      </div>
    </section>
  );
}

export default Contact;