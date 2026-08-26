// src/Components/About.jsx - RESPONSIVE MOBILE-FRIENDLY ABOUT CHEF
import React from 'react';

function About() {
  return (
    <section className="about-section" id="about">
      <div className="about-container">
        
        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h2 style={{
            fontSize: 'clamp(2rem, 5vw, 2.75rem)',
            fontWeight: '800',
            color: '#7c2d12',
            marginBottom: '0.75rem',
            letterSpacing: '-0.02em'
          }}>
            About Chef Srinivas
          </h2>
          <div style={{
            width: '80px',
            height: '4px',
            backgroundColor: '#d97706',
            margin: '0 auto 1.25rem',
            borderRadius: '2px'
          }}></div>
        </div>

        {/* Content Card */}
        <div className="about-card">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <p style={{
              fontSize: 'clamp(1rem, 2.5vw, 1.15rem)',
              color: '#374151',
              lineHeight: '1.75',
              textAlign: 'center',
              margin: 0
            }}>
              With over <span style={{ color: '#d97706', fontWeight: '700' }}>15 years of culinary mastery</span>, 
              Chef Srinivas brings a passionate devotion to authentic Indian recipes and international culinary excellence. 
              Trained extensively in royal regional cuisines and modern dining techniques, he crafts memorable meals that enchant the senses.
            </p>
            
            <p style={{
              fontSize: 'clamp(1rem, 2.5vw, 1.15rem)',
              color: '#374151',
              lineHeight: '1.75',
              textAlign: 'center',
              margin: 0
            }}>
              Whether hosting an <span style={{ color: '#d97706', fontWeight: '700' }}>intimate family dinner</span> or a 
              grand gathering of hundreds, Chef Srinivas customizes each menu using only the freshest, hand-picked ingredients to ensure an 
              <span style={{ color: '#d97706', fontWeight: '700' }}> extraordinary dining celebration</span>.
            </p>
          </div>

          {/* Feature Badges Grid */}
          <div className="about-badges-grid">
            <div className="about-badge-card">
              <div style={{ fontSize: '2.2rem', marginBottom: '0.35rem' }}>👨‍🍳</div>
              <h3 style={{ fontWeight: '700', color: '#7c2d12', margin: '0 0 0.25rem 0', fontSize: '1.1rem' }}>
                15+ Years
              </h3>
              <p style={{ fontSize: '0.875rem', color: '#d97706', margin: 0, fontWeight: '500' }}>
                Culinary Experience
              </p>
            </div>
            
            <div className="about-badge-card">
              <div style={{ fontSize: '2.2rem', marginBottom: '0.35rem' }}>🌍</div>
              <h3 style={{ fontWeight: '700', color: '#7c2d12', margin: '0 0 0.25rem 0', fontSize: '1.1rem' }}>
                Authentic & Global
              </h3>
              <p style={{ fontSize: '0.875rem', color: '#d97706', margin: 0, fontWeight: '500' }}>
                Diverse Gourmet Styles
              </p>
            </div>
            
            <div className="about-badge-card">
              <div style={{ fontSize: '2.2rem', marginBottom: '0.35rem' }}>⭐</div>
              <h3 style={{ fontWeight: '700', color: '#7c2d12', margin: '0 0 0.25rem 0', fontSize: '1.1rem' }}>
                100% Customized
              </h3>
              <p style={{ fontSize: '0.875rem', color: '#d97706', margin: 0, fontWeight: '500' }}>
                Bespoke Menu Planning
              </p>
            </div>
          </div>

          {/* Chef Signature Quote */}
          <div style={{
            textAlign: 'center',
            marginTop: '2rem',
            paddingTop: '1.5rem',
            borderTop: '1.5px solid #fed7aa'
          }}>
            <p style={{
              color: '#7c2d12',
              fontWeight: '600',
              fontStyle: 'italic',
              margin: 0,
              fontSize: 'clamp(1rem, 2.5vw, 1.15rem)'
            }}>
              "Creating timeless dining memories, one extraordinary dish at a time."
            </p>
            <p style={{
              color: '#d97706',
              fontSize: '0.9rem',
              fontWeight: '700',
              margin: '0.35rem 0 0 0'
            }}>
              — Chef Srinivas
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;