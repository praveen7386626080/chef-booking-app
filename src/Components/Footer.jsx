import { Link } from 'react-router-dom';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <p>
        © {currentYear} Chef Srinivas's Kitchen. All rights reserved.
        <Link 
          to="/admin" 
          style={{ 
            color: 'inherit', 
            textDecoration: 'none', 
            opacity: 0.35, 
            marginLeft: '12px',
            fontSize: '0.85rem'
          }} 
          title="Chef Management Portal"
          aria-label="Staff Portal"
        >
          🔒
        </Link>
      </p>
    </footer>
  );
}

export default Footer;