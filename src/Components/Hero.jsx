// src/Components/Hero.jsx - RESPONSIVE MOBILE-FRIENDLY HERO
import React from 'react';

function Hero() {
  const handleViewMenu = () => {
    const menuSection = document.getElementById('menu');
    if (menuSection) {
      const headerOffset = 70;
      const elementPosition = menuSection.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const handleContactChef = () => {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      const headerOffset = 70;
      const elementPosition = contactSection.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className="hero" id="home">
      <div className="hero-content">
        <h2>
          Exquisite Private Dining Experiences
        </h2>
        <p>
          Book Chef Srinivas for an unforgettable culinary journey prepared fresh in the comfort of your own home or special event.
        </p>
        
        <div className="hero-cta-group">
          <button 
            onClick={handleViewMenu}
            className="cta-button"
            type="button"
          >
            🍽️ Explore Signature Menu
          </button>
          
          <button 
            onClick={handleContactChef}
            className="cta-button-secondary"
            type="button"
          >
            ✉️ Inquire Event
          </button>
        </div>
      </div>
    </section>
  );
}

export default Hero;