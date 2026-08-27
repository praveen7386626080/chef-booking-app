// src/Components/Header.jsx - MOBILE RESPONSIVE WITH HAMBURGER MENU
import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [activeNav, setActiveNav] = useState('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Handle scroll detection and active link highlighting
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 30;
      setScrolled(isScrolled);
    };

    const sections = ['home', 'menu', 'about', 'contact'];

    const updateActiveNav = () => {
      if (location.pathname === '/admin') {
        setActiveNav('admin');
        return;
      }
      if (location.pathname === '/test') {
        setActiveNav('test');
        return;
      }

      if (location.hash) {
        const hashSection = location.hash.replace('#', '');
        if (sections.includes(hashSection)) {
          setActiveNav(hashSection);
          return;
        }
      }

      const currentSection = sections.find(section => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 120 && rect.bottom >= 120;
        }
        return false;
      });

      if (currentSection) {
        setActiveNav(currentSection);
      } else {
        setActiveNav('home');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('scroll', updateActiveNav, { passive: true });

    updateActiveNav();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('scroll', updateActiveNav);
    };
  }, [location.pathname, location.hash]);

  // Close mobile menu on Escape key press or screen resize
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false);
      }
    };

    const handleResize = () => {
      if (window.innerWidth > 860) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Prevent background scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const handleNavClick = (e, sectionId) => {
    e.preventDefault();
    setMobileMenuOpen(false);

    const targetHash = `#${sectionId}`;
    if (location.pathname !== '/') {
      navigate(`/${targetHash}`);
      return;
    }

    if (location.hash !== targetHash) {
      navigate(`/${targetHash}`, { replace: true });
    }

    const element = document.getElementById(sectionId);
    if (element) {
      const headerOffset = 70;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }

    setActiveNav(sectionId);
  };

  useEffect(() => {
    if (location.pathname !== '/') return;
    if (!location.hash) return;

    const sectionId = location.hash.replace('#', '');
    const element = document.getElementById(sectionId);
    if (element) {
      const headerOffset = 70;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      setActiveNav(sectionId);
    }
  }, [location.pathname, location.hash]);

  const isActive = (navItem) => activeNav === navItem;

  return (
    <header className={`header ${scrolled ? 'scrolled' : ''}`}>
      <div className="header-container">
        {/* Brand Logo & Name */}
        <Link 
          to="/" 
          className="brand-link" 
          onClick={(e) => {
            if (location.pathname === '/') {
              handleNavClick(e, 'home');
            } else {
              setMobileMenuOpen(false);
            }
          }}
        >
          <span className="brand-badge">👨‍🍳</span>
          <h1 className="brand-title">Chef Srinivas's Kitchen</h1>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="nav-desktop" aria-label="Main Navigation">
          <Link 
            to="/" 
            onClick={(e) => handleNavClick(e, 'home')}
            className={isActive('home') ? 'active' : ''}
            aria-current={isActive('home') ? 'page' : undefined}
          >
            Home
          </Link>
          <Link 
            to="/" 
            onClick={(e) => handleNavClick(e, 'menu')}
            className={isActive('menu') ? 'active' : ''}
            aria-current={isActive('menu') ? 'page' : undefined}
          >
            Menu
          </Link>
          <Link 
            to="/" 
            onClick={(e) => handleNavClick(e, 'about')}
            className={isActive('about') ? 'active' : ''}
            aria-current={isActive('about') ? 'page' : undefined}
          >
            About
          </Link>
          <Link 
            to="/" 
            onClick={(e) => handleNavClick(e, 'contact')}
            className={isActive('contact') ? 'active' : ''}
            aria-current={isActive('contact') ? 'page' : undefined}
          >
            Contact
          </Link>
        </nav>

        {/* Mobile Hamburger Button */}
        <button
          type="button"
          className={`hamburger-btn ${mobileMenuOpen ? 'open' : ''}`}
          onClick={() => setMobileMenuOpen(prev => !prev)}
          aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={mobileMenuOpen}
        >
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
        </button>
      </div>

      {/* Mobile Backdrop Overlay */}
      <div 
        className={`mobile-overlay ${mobileMenuOpen ? 'open' : ''}`} 
        onClick={() => setMobileMenuOpen(false)}
        aria-hidden="true"
      />

      {/* Mobile Navigation Drawer */}
      <nav 
        className={`mobile-nav-drawer ${mobileMenuOpen ? 'open' : ''}`}
        aria-label="Mobile Navigation"
      >
        <div className="mobile-nav-links">
          <Link 
            to="/" 
            onClick={(e) => handleNavClick(e, 'home')}
            className={`mobile-nav-link ${isActive('home') ? 'active' : ''}`}
          >
            <span>🏠</span>
            <span>Home</span>
          </Link>
          <Link 
            to="/" 
            onClick={(e) => handleNavClick(e, 'menu')}
            className={`mobile-nav-link ${isActive('menu') ? 'active' : ''}`}
          >
            <span>🍛</span>
            <span>Menu</span>
          </Link>
          <Link 
            to="/" 
            onClick={(e) => handleNavClick(e, 'about')}
            className={`mobile-nav-link ${isActive('about') ? 'active' : ''}`}
          >
            <span>👨‍🍳</span>
            <span>About Chef</span>
          </Link>
          <Link 
            to="/" 
            onClick={(e) => handleNavClick(e, 'contact')}
            className={`mobile-nav-link ${isActive('contact') ? 'active' : ''}`}
          >
            <span>📞</span>
            <span>Contact & Book</span>
          </Link>
        </div>

        <div className="mobile-nav-footer">
          <p>Chef Srinivas's Kitchen</p>
          <p style={{ fontSize: '0.75rem', opacity: 0.8, marginTop: '4px' }}>Authentic Private Dining</p>
        </div>
      </nav>
    </header>
  );
}

export default Header;