// App.jsx - RESPONSIVE MOBILE OPTIMIZED WITH QUICK WHATSAPP ACTIONS
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './Components/Header';
import Hero from './Components/Hero';
import Menu from './Components/Menu';
import About from './Components/About';
import Contact from './Components/Contact';
import Admin from './Components/Admin';
import Footer from './Components/Footer';
import './App.css';

function HomePage() {
  return (
    <>
      <Hero />
      <Menu />
      <About />
      <Contact />
    </>
  );
}

function ConnectionTest() {
  const [message, setMessage] = useState('Testing connection...');
  const [backendStatus, setBackendStatus] = useState('checking');

  useEffect(() => {
    fetch('/api')
      .then(response => response.json())
      .then(data => {
        setMessage(data.message);
        setBackendStatus('connected');
      })
      .catch(error => {
        setMessage('Backend connection failed: ' + error.message);
        setBackendStatus('failed');
      });
  }, []);

  return (
    <div style={{ 
      padding: '50px 20px', 
      textAlign: 'center',
      backgroundColor: backendStatus === 'connected' ? '#dcfce7' : 
                     backendStatus === 'failed' ? '#fee2e2' : '#fef9c3',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <h1 style={{ fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', marginBottom: '1rem' }}>Frontend-Backend Connection</h1>
      <p style={{ fontSize: 'clamp(1.1rem, 3vw, 1.4rem)', margin: '15px 0' }}>{message}</p>
      <p style={{ fontWeight: '600' }}>Status: <span style={{ color: backendStatus === 'connected' ? '#16a34a' : '#dc2626' }}>{backendStatus}</span></p>
      
      {backendStatus === 'connected' && (
        <div style={{ marginTop: '25px', display: 'flex', gap: '15px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <a 
            href="/admin" 
            style={{
              padding: '12px 24px',
              backgroundColor: '#2563eb',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '8px',
              fontWeight: '600'
            }}
          >
            Admin Panel
          </a>
          <a 
            href="/" 
            style={{
              padding: '12px 24px',
              backgroundColor: '#16a34a',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '8px',
              fontWeight: '600'
            }}
          >
            Main Website
          </a>
        </div>
      )}
    </div>
  );
}

function App() {
  const [showWAOptions, setShowWAOptions] = useState(false);

  const getWaLink = (msg) => {
    const phone = '919876543210';
    const text = encodeURIComponent(msg);
    return `https://wa.me/${phone}?text=${text}`;
  };

  const sendWhatsApp = (rawMessage) => {
    const phone = '919876543210';
    const text = encodeURIComponent(rawMessage);
    const url = `https://wa.me/${phone}?text=${text}`;
    window.open(url, '_blank', 'noopener');
    setShowWAOptions(false);
  };

  return (
    <Router>
      <div className="App">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/test" element={<ConnectionTest />} />
          </Routes>
        </main>
        <Footer />
        
        {/* Backdrop for mobile WhatsApp suggestions dismissal */}
        {showWAOptions && (
          <div 
            className="whatsapp-backdrop" 
            onClick={() => setShowWAOptions(false)} 
            aria-hidden="true"
          />
        )}

        {/* === WHATSAPP FLOATING ACTION BUTTON === */}
        <div className="whatsapp-float">
          {/* Toggle button */}
          <button
            type="button"
            className="whatsapp-link"
            onClick={() => setShowWAOptions(prev => !prev)}
            aria-expanded={showWAOptions}
            aria-label="Open WhatsApp Quick Chat"
          >
            <svg width="30" height="30" viewBox="0 0 24 24" fill="white">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893c0-3.18-1.24-6.171-3.495-8.428"/>
            </svg>
          </button>

          {/* Desktop Hover Label */}
          <button
            type="button"
            className="whatsapp-side-label"
            onClick={() => setShowWAOptions(prev => !prev)}
            aria-expanded={showWAOptions}
          >
            Chat with Chef Srinivas
          </button>

          {/* Suggestions Popup */}
          {showWAOptions && (
            <div className="whatsapp-popup" role="menu" aria-label="WhatsApp quick suggestions">
              <button
                type="button"
                className="whatsapp-suggestion"
                onClick={() => sendWhatsApp("Hi Chef Srinivas, I would like to book catering for an upcoming event.")}
              >
                📅 Book Event Catering
              </button>

              <button
                type="button"
                className="whatsapp-suggestion"
                onClick={() => sendWhatsApp("Hi Chef Srinivas, I need pricing and details for your signature dishes.")}
              >
                🍛 Menu & Price Inquiry
              </button>

              <button
                type="button"
                className="whatsapp-suggestion"
                onClick={() => sendWhatsApp("Hi Chef Srinivas, I would like to request a custom menu for my party.")}
              >
                ✨ Custom Menu Request
              </button>

              <a
                className="whatsapp-suggestion whatsapp-chat"
                href={getWaLink("Hi Chef Srinivas, I would like to chat with you about your culinary services.")}
                target="_blank"
                rel="noopener noreferrer"
              >
                💬 Direct Chat on WhatsApp
              </a>
            </div>
          )}
        </div>
      </div>
    </Router>
  );
}

export default App;