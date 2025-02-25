import React from 'react';
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <div>
      {/* Navbar & Hero Start */}
      <div className="container-fluid position-relative p-0">
        <nav className="navbar navbar-expand-lg navbar-light px-4 px-lg-5 py-3 py-lg-0">
          <a href="#home" className="navbar-brand p-0">
            <h1 className="text-primary">
              <i className="fas fa-search-dollar me-3" />TunisBalance
            </h1>
          </a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarCollapse">
            <span className="fa fa-bars" />
          </button>
          <div className="collapse navbar-collapse" id="navbarCollapse">
            <div className="navbar-nav ms-auto py-0">
              <a href="#home" className="nav-item nav-link active">Home</a>
              <a href="#about" className="nav-item nav-link">About</a>
              <a href="#services" className="nav-item nav-link">Services</a>
              <a href="#blog" className="nav-item nav-link">Blogs</a>
              <div className="nav-item dropdown">
                <a href="#" className="nav-link" data-bs-toggle="dropdown">
                  <span className="dropdown-toggle">Pages</span>
                </a>
                <div className="dropdown-menu m-0">
                  <a href="#features" className="dropdown-item">Our Features</a>
                  <a href="#team" className="dropdown-item">Our Team</a>
                  <a href="#testimonial" className="dropdown-item">Testimonial</a>
                  <a href="#offer" className="dropdown-item">Our Offer</a>
                  <a href="#faq" className="dropdown-item">FAQs</a>
                  <a href="#404" className="dropdown-item">404 Page</a>
                </div>
              </div>
              <a href="#contact" className="nav-item nav-link">Contact Us</a>
            </div>
            {/* Added Sign Up and Login Buttons */}
            <div className="d-flex align-items-center ms-3">
            <Link to="/register" className="btn btn-light rounded-pill py-2 px-4 me-2">Sign Up</Link>
            <Link to="/login" className="btn btn-primary rounded-pill py-2 px-4">Login</Link>
            </div>
          </div>
        </nav>

        {/* Carousel Start */}
        <div className="header-carousel owl-carousel owl-loaded owl-drag">
          {/* First Carousel Item */}
          <div className="owl-item active" style={{ width: "100%" }}>
            <div className="header-carousel-item">
              <img src="assets/img/carousel-1.jpg" className="img-fluid w-100" alt="Image" />
              <div className="carousel-caption">
                <div className="container">
                  <div className="row gy-0 gx-5">
                    <div className="col-lg-0 col-xl-5" />
                    <div className="col-xl-7 animated fadeInLeft">
                      <div className="text-sm-center text-md-end">
                        <h4 className="text-primary text-uppercase fw-bold mb-4 animated fadeInLeft">Welcome To TunisBalance</h4>
                        <h1 className="display-4 text-uppercase text-white mb-4 animated fadeInLeft">Invest your money with higher return</h1>
                        <p className="mb-5 fs-5 animated fadeInLeft">
                          Lorem Ipsum is simply dummy text of the printing and typesetting industry...
                        </p>
                        <div className="d-flex justify-content-center justify-content-md-end flex-shrink-0 mb-4">
                          <a href="#watch-video" className="btn btn-light rounded-pill py-3 px-4 px-md-5 me-2 animated fadeInLeft">
                            <i className="fas fa-play-circle me-2" /> Watch Video
                          </a>
                          <a href="#learn-more" className="btn btn-primary rounded-pill py-3 px-4 px-md-5 ms-2 animated fadeInLeft">Learn More</a>
                        </div>
                        <div className="d-flex align-items-center justify-content-center justify-content-md-end">
                          <h2 className="text-white me-2">Follow Us:</h2>
                          <div className="d-flex justify-content-end ms-2">
                            <a href="https://facebook.com" className="btn btn-md-square btn-light rounded-circle me-2">
                              <i className="fab fa-facebook-f" />
                            </a>
                            <a href="https://twitter.com" className="btn btn-md-square btn-light rounded-circle mx-2">
                              <i className="fab fa-twitter" />
                            </a>
                            <a href="https://instagram.com" className="btn btn-md-square btn-light rounded-circle mx-2">
                              <i className="fab fa-instagram" />
                            </a>
                            <a href="https://linkedin.com" className="btn btn-md-square btn-light rounded-circle ms-2">
                              <i className="fab fa-linkedin-in" />
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Second Carousel Item */}
        </div>
        {/* Carousel End */}
      </div>
      {/* Navbar & Hero End */}
    </div>
  );
}

export default Navbar;
