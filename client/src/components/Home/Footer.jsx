import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/landing.css';

function Footer() {
  return (
    <footer className="landing-footer">
      <div className="container mx-auto px-6">
        <div className="landing-footer-content">
          <div>
            <div className="landing-footer-logo">TuniBalance</div>
            <p className="landing-footer-description">
              Simplifying financial management for businesses and individuals. Track expenses, manage invoices, and gain insights with our powerful platform.
            </p>
            <div className="landing-footer-social">
              <a href="#" className="landing-footer-social-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
              </a>
              <a href="#" className="landing-footer-social-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
                </svg>
              </a>
              <a href="#" className="landing-footer-social-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>
              <a href="#" className="landing-footer-social-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                  <rect x="2" y="9" width="4" height="12"></rect>
                  <circle cx="4" cy="4" r="2"></circle>
                </svg>
              </a>
            </div>
          </div>

          <div>
            <h3 className="landing-footer-title">Quick Links</h3>
            <div className="landing-footer-links">
              <a href="#hero" className="landing-footer-link">Home</a>
              <a href="#about" className="landing-footer-link">About</a>
              <a href="#features" className="landing-footer-link">Features</a>
              <a href="#services" className="landing-footer-link">Services</a>
              <a href="#contact" className="landing-footer-link">Contact</a>
            </div>
          </div>

          <div>
            <h3 className="landing-footer-title">Services</h3>
            <div className="landing-footer-links">
              <a href="#" className="landing-footer-link">Financial Tracking</a>
              <a href="#" className="landing-footer-link">Invoice Management</a>
              <a href="#" className="landing-footer-link">Financial Reports</a>
              <a href="#" className="landing-footer-link">Time Tracking</a>
              <a href="#" className="landing-footer-link">Multi-Currency Support</a>
            </div>
          </div>

          <div>
            <h3 className="landing-footer-title">Contact Us</h3>
            <div className="landing-footer-links">
              <p className="landing-footer-link">123 Finance Street</p>
              <p className="landing-footer-link">Tunis, Tunisia</p>
              <p className="landing-footer-link">Email: info@tunibalance.com</p>
              <p className="landing-footer-link">Phone: +216 123 456 789</p>
            </div>
          </div>
        </div>

        <div className="landing-footer-bottom">
          <p>&copy; {new Date().getFullYear()} TuniBalance. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer