import React from 'react';

function Hero() {
  const handleViewMenu = () => {
    // Option 1: Scroll to menu section (if on same page)
    const menuSection = document.getElementById('menu');
    if (menuSection) {
      menuSection.scrollIntoView({ behavior: 'smooth' });
    }
    
    // Option 2: Navigate to menu page using hash
    // window.location.hash = "#menu";
    
    // Option 3: Navigate to separate menu page (if using React Router)
    // navigate('/menu');
  };

  

  return (
    <section className="hero min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-900 to-purple-900 text-white" id="home">
      <div className="hero-content text-center max-w-4xl mx-auto px-4">
        <h2 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
          Exquisite Private Dining Experiences
        </h2>
        <p className="text-xl md:text-2xl mb-8 text-gray-200">
          Book a professional chef for an unforgettable evening in your own home.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button 
            onClick={handleViewMenu}
            className="cta-button bg-amber-500 hover:bg-amber-600 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 text-lg"
          >
            View Menu & Book Now
          </button>
          
  
        </div>
      </div>
    </section>
  );
}

export default Hero;