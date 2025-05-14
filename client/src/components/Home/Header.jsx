import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../../styles/landing.css';

function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Handle scroll event to change header style
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    // Prevent scrolling when mobile menu is open
    document.body.style.overflow = isMobileMenuOpen ? 'auto' : 'hidden';
  };

  return (
    <>
      <header className={`landing-header ${isScrolled ? 'scrolled' : ''}`}>
        <div className="container mx-auto">
          <nav className="landing-nav">
            <Link to="/" className="landing-logo">
              TuniBalance
            </Link>

            {/* Desktop Menu */}
            <div className="landing-menu">
              <a href="#hero" className="landing-menu-item active">Home</a>
              <a href="#about" className="landing-menu-item">About</a>
              <a href="#services" className="landing-menu-item">Services</a>
              <a href="#team" className="landing-menu-item">Team</a>
              <a href="#contact" className="landing-menu-item">Contact</a>
            </div>

            {/* CTA Buttons */}
            <div className="landing-cta">
              <Link to="/login" className="landing-button landing-button-secondary">
                Login
              </Link>
              <Link to="/register" className="landing-button landing-button-primary">
                Sign Up
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="landing-mobile-menu-button"
              onClick={toggleMobileMenu}
              aria-label="Toggle mobile menu"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </nav>
        </div>
      </header>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="landing-mobile-menu">
          <button
            className="landing-mobile-menu-close"
            onClick={toggleMobileMenu}
            aria-label="Close mobile menu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="landing-mobile-menu-items">
            <a href="#hero" className="landing-menu-item active" onClick={toggleMobileMenu}>Home</a>
            <a href="#about" className="landing-menu-item" onClick={toggleMobileMenu}>About</a>
            <a href="#services" className="landing-menu-item" onClick={toggleMobileMenu}>Services</a>
            <a href="#team" className="landing-menu-item" onClick={toggleMobileMenu}>Team</a>
            <a href="#contact" className="landing-menu-item" onClick={toggleMobileMenu}>Contact</a>

            <div className="flex flex-col gap-4 mt-8">
              <Link to="/login" className="landing-button landing-button-secondary" onClick={toggleMobileMenu}>
                Login
              </Link>
              <Link to="/register" className="landing-button landing-button-primary" onClick={toggleMobileMenu}>
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Header;