import React from 'react';

function About() {
  return (
    <section 
      className="about py-16 px-4" 
      id="about"
      style={{
        background: 'linear-gradient(135deg, #fffbeb 0%, #fed7aa 100%)',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center'
      }}
    >
      <div className="max-w-4xl mx-auto" style={{width: '100%'}}>
        
        {/* Header Section */}
        <div style={{textAlign: 'center', marginBottom: '3rem'}}>
          <h2 style={{
            fontSize: '2.5rem',
            fontWeight: 'bold',
            color: '#7c2d12',
            marginBottom: '1rem'
          }}>
            About Chef Srinivas
          </h2>
          <div style={{
            width: '96px',
            height: '4px',
            backgroundColor: '#d97706',
            margin: '0 auto 1.5rem auto',
            borderRadius: '2px'
          }}></div>
        </div>

        {/* Content Section */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '1rem',
          boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
          padding: '2rem',
          marginBottom: '2rem'
        }}>
          <div style={{display: 'flex', flexDirection: 'column', gap: '1.5rem'}}>
            <p style={{
              fontSize: '1.125rem',
              color: '#374151',
              lineHeight: '1.75',
              textAlign: 'center',
              margin: 0
            }}>
              With over <span style={{color: '#d97706', fontWeight: '600'}}>15 years of culinary experience</span>, 
              Chef Srinivas brings a passion for authentic flavors and a commitment to excellence to every 
              dining experience. Trained in both traditional Indian cuisine and international techniques, 
              he creates memorable meals that delight the senses.
            </p>
            
            <p style={{
              fontSize: '1.125rem',
              color: '#374151',
              lineHeight: '1.75',
              textAlign: 'center',
              margin: 0
            }}>
              Whether it's an <span style={{color: '#d97706', fontWeight: '600'}}>intimate dinner for two</span> or a 
              large family gathering, Chef Srinivas customizes each menu to your preferences, using only the 
              freshest, highest-quality ingredients. His goal is to provide not just a meal, but an 
              <span style={{color: '#d97706', fontWeight: '600'}}> unforgettable event</span>.
            </p>
          </div>

          {/* Additional Features */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1.5rem',
            marginTop: '2.5rem'
          }}>
            <div style={{
              textAlign: 'center',
              padding: '1rem',
              backgroundColor: '#fffbeb',
              borderRadius: '0.5rem',
              border: '2px solid #fed7aa'
            }}>
              <div style={{fontSize: '2rem', marginBottom: '0.5rem'}}>👨‍🍳</div>
              <h3 style={{fontWeight: '600', color: '#7c2d12', margin: '0 0 0.25rem 0'}}>15+ Years</h3>
              <p style={{fontSize: '0.875rem', color: '#d97706', margin: 0}}>Culinary Experience</p>
            </div>
            
            <div style={{
              textAlign: 'center',
              padding: '1rem',
              backgroundColor: '#fffbeb',
              borderRadius: '0.5rem',
              border: '2px solid #fed7aa'
            }}>
              <div style={{fontSize: '2rem', marginBottom: '0.5rem'}}>🌍</div>
              <h3 style={{fontWeight: '600', color: '#7c2d12', margin: '0 0 0.25rem 0'}}>International</h3>
              <p style={{fontSize: '0.875rem', color: '#d97706', margin: 0}}>Training & Techniques</p>
            </div>
            
            <div style={{
              textAlign: 'center',
              padding: '1rem',
              backgroundColor: '#fffbeb',
              borderRadius: '0.5rem',
              border: '2px solid #fed7aa'
            }}>
              <div style={{fontSize: '2rem', marginBottom: '0.5rem'}}>⭐</div>
              <h3 style={{fontWeight: '600', color: '#7c2d12', margin: '0 0 0.25rem 0'}}>Customized</h3>
              <p style={{fontSize: '0.875rem', color: '#d97706', margin: 0}}>Menu Planning</p>
            </div>
          </div>

          {/* Signature */}
          <div style={{
            textAlign: 'center',
            marginTop: '2rem',
            paddingTop: '1.5rem',
            borderTop: '2px solid #fed7aa'
          }}>
            <p style={{
              color: '#7c2d12',
              fontWeight: '600',
              fontStyle: 'italic',
              margin: 0,
              fontSize: '1.125rem'
            }}>
              "Creating memories one meal at a time"
            </p>
            <p style={{
              color: '#d97706',
              fontSize: '0.875rem',
              margin: '0.25rem 0 0 0'
            }}>
              - Chef Srinivas
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;