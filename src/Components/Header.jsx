// src/components/Header.jsx - UPDATED WITH ACTIVE STATES
import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [activeNav, setActiveNav] = useState('home');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 50;
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
          return rect.top <= 100 && rect.bottom >= 100;
        }
        return false;
      });

      if (currentSection) {
        setActiveNav(currentSection);
      } else {
        setActiveNav('home');
      }
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('scroll', updateActiveNav);

    updateActiveNav();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('scroll', updateActiveNav);
    };
  }, [location.pathname, location.hash]);

  const handleNavClick = (e, sectionId) => {
    e.preventDefault();

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
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
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
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveNav(sectionId);
    }
  }, [location.pathname, location.hash]);

  const isActive = (navItem) => activeNav === navItem;

  return (
    <header className={`header ${scrolled ? 'scrolled' : ''}`}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 20px'
      }}>
        <Link to="/" style={{ textDecoration: 'none' }}>
          <h1>Chef Srinivas's Kitchen</h1>
        </Link>
        <nav className="nav">
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
          <Link 
            to="/admin"
            className={isActive('admin') ? 'active' : ''}
            aria-current={isActive('admin') ? 'page' : undefined}
          >
            Admin
          </Link>
          {/* Test link removed per request */}
        </nav>
      </div>
    </header>
  );
}

export default Header;