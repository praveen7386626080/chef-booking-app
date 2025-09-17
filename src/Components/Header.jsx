// src/components/Header.jsx
function Header() {
  const handleNavClick = (e, sectionId) => {
    e.preventDefault();
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start' 
      });
    }
  };

  return (
    <header className="header">
      <h1>Chef Srinivas's Kitchen</h1>
      <nav className="nav">
        <a href="#home" onClick={(e) => handleNavClick(e, 'home')}>Home</a>
        <a href="#menu" onClick={(e) => handleNavClick(e, 'menu')}>Menu</a>
        <a href="#about" onClick={(e) => handleNavClick(e, 'about')}>About</a>
        <a href="#contact" onClick={(e) => handleNavClick(e, 'contact')}>Contact</a>
        {/* Add Admin link */}
        <a href="#admin" onClick={(e) => handleNavClick(e, 'admin')}>Admin</a>
      </nav>
    </header>
  );
}

export default Header;