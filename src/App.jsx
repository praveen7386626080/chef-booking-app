// App.jsx - FIXED VERSION with WhatsApp Button
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Hero from './components/Hero';
import Menu from './components/Menu';
import About from './components/About';
import Contact from './components/Contact';
import Admin from './components/Admin';
import Footer from './components/Footer';
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
      padding: '50px', 
      textAlign: 'center',
      backgroundColor: backendStatus === 'connected' ? 'lightgreen' : 
                     backendStatus === 'failed' ? 'lightcoral' : 'lightyellow',
      minHeight: '100vh'
    }}>
      <h1>Frontend-Backend Connection Test</h1>
      <p style={{ fontSize: '24px', margin: '20px 0' }}>{message}</p>
      <p>Backend Status: <strong>{backendStatus}</strong></p>
      
      {backendStatus === 'connected' && (
        <div style={{ marginTop: '30px' }}>
          <a 
            href="/admin" 
            style={{
              padding: '15px 30px',
              backgroundColor: 'blue',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '8px',
              fontSize: '18px',
              display: 'inline-block',
              margin: '10px'
            }}
          >
            Go to Admin Panel
          </a>
          <br />
          <a 
            href="/" 
            style={{
              padding: '15px 30px',
              backgroundColor: 'green',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '8px',
              fontSize: '18px',
              display: 'inline-block',
              margin: '10px'
            }}
          >
            Go to Main Website
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

  const sendWhatsApp = (encodedMessage) => {
    // encodedMessage should be URL-encoded already when passed
    const phone = '919876543210';
    const url = `https://wa.me/${phone}?text=${encodedMessage}`;
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
        
        {/* === WHATSAPP FLOATING BUTTON + QUICK SUGGESTIONS === */}
        <div className="whatsapp-float">
          {/* Toggle button for suggestions (icon) */}
          <button
            type="button"
            className="whatsapp-link"
            onClick={() => setShowWAOptions(prev => !prev)}
            aria-expanded={showWAOptions}
            aria-label="Open WhatsApp suggestions"
          >
            {/* WhatsApp SVG Icon */}
            <svg width="32" height="32" viewBox="0 0 24 24" fill="white">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893c0-3.18-1.24-6.171-3.495-8.428"/>
            </svg>
          </button>

          {/* Side heading / label next to the floating WhatsApp button (appears on icon hover) */}
          <button
            type="button"
            className="whatsapp-side-label"
            onClick={() => setShowWAOptions(prev => !prev)}
            aria-expanded={showWAOptions}
          >
            Chat on WhatsApp
          </button>

          {/* Suggestions popup */}
          {showWAOptions && (
            <div className="whatsapp-popup" role="menu" aria-label="WhatsApp quick suggestions">
              <button
                className="whatsapp-suggestion"
                onClick={() => sendWhatsApp("I'm%20online%20-%20I%20want%20the%20shoe%20shown%20on%20the%20website.")}
              >I'm online — I want this Dish</button>

              <button
                className="whatsapp-suggestion"
                onClick={() => sendWhatsApp("I'm%20online%20-%20I%20need%20size%20and%20price%20information%20for%20the%20shoe.")}
              >Need Another Dish & price</button>

              <button
                className="whatsapp-suggestion"
                onClick={() => sendWhatsApp("Please%20send%20the%20product%20link%20for%20the%20shoe%20shown%20on%20the%20website.")}
              >Send Dish Images</button>

              <a
                className="whatsapp-suggestion whatsapp-chat"
                href={getWaLink("Hi Chef Srinivas, I would like to book your services")}
                target="_blank"
                rel="noopener noreferrer"
              >Chat with Chef</a>
            </div>
          )}
        </div>
        {/* === END WHATSAPP BUTTON === */}
        
      </div>
    </Router>
  );
}

export default App;