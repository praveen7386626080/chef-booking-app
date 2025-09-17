// src/components/Footer.jsx

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <p>© {currentYear} Chef Srinivas's Kitchen. All rights reserved.</p>
    </footer>
  );
}

export default Footer;