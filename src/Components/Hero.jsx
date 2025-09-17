// src/components/Hero.jsx

function Hero() {
  return (
    <section className="hero" id="home"> {/* Added id="home" here */}
      <div className="hero-content">
        <h2>Exquisite Private Dining Experiences</h2>
        <p>Book a professional chef for an unforgettable evening in your own home.</p>
        <button className="cta-button">View Menu & Book Now</button>
      </div>
    </section>
  );
}

export default Hero;