import React from 'react';

function Header() {
  return (
    <header id="header" className="header d-flex align-items-center fixed-top">
      <div className="container-fluid container-xl position-relative d-flex align-items-center">
        <a href="index.html" className="logo d-flex align-items-center me-auto">
          {/* You can uncomment the img tag if you want to use a logo image instead of text */}
          {/* <img src="path/to/logo.png" alt="Logo" /> */}
          <h1 className="sitename">Arsha</h1>
        </a>
        <nav id="navmenu" className="navmenu">
          <ul>
            <li><a href="#hero" className="active">Home</a></li>
            <li><a href="#about">About</a></li>
            <li><a href="#services">Services</a></li>
            <li><a href="#portfolio">Portfolio</a></li>
            <li><a href="#team">Team</a></li>
            <li><a href="#pricing">Pricing</a></li>
            <li><a href="blog.html">Blog</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
          <i className="mobile-nav-toggle d-xl-none bi bi-list" />
        </nav>
        <a className="btn-getstarted" href="login">Login</a>
        <a className="btn-getstarted ms-2" href="Register">Sign Up</a>
      </div>
    </header>
  );
}

export default Header;