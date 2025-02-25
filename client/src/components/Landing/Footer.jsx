import React from 'react';

function Footer() {
  return (
    <div>
      {/* Footer Start */}
      <div className="container-fluid footer py-5 wow fadeIn" data-wow-delay="0.2s">
        <div className="container py-5 border-start-0 border-end-0" style={{border: '1px solid', borderColor: 'rgba(255, 255, 255, 0.08)'}}>
          <div className="row g-5">
            {/* Footer Item 1 - App Store Links */}
            <div className="col-md-6 col-lg-6 col-xl-4">
              <div className="footer-item">
                <a href="index.html" className="p-0">
                  <h4 className="text-white mb-3"><i className="fas fa-search-dollar me-3" />Stocker</h4>
                  <p className="mb-4">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam euismod bibendum purus, ut aliquet dui.</p>
                </a>
                <div className="d-flex">
                  <a href="#" className="bg-primary d-flex rounded align-items-center py-2 px-3 me-2 hover-effect">
                    <i className="fas fa-apple-alt text-white" />
                    <div className="ms-3">
                      <small className="text-white">Download on the</small>
                      <h6 className="text-white">App Store</h6>
                    </div>
                  </a>
                  <a href="#" className="bg-dark d-flex rounded align-items-center py-2 px-3 ms-2 hover-effect">
                    <i className="fas fa-play text-primary" />
                    <div className="ms-3">
                      <small className="text-white">Get it on</small>
                      <h6 className="text-white">Google Play</h6>
                    </div>
                  </a>
                </div>
              </div>
            </div>

            {/* Footer Item 2 - Quick Links */}
            <div className="col-md-6 col-lg-6 col-xl-2">
              <div className="footer-item">
                <h4 className="text-white mb-4">Quick Links</h4>
                <ul className="list-unstyled">
                  <li><a href="#" className="text-white"><i className="fas fa-angle-right me-2" /> About Us</a></li>
                  <li><a href="#" className="text-white"><i className="fas fa-angle-right me-2" /> Feature</a></li>
                  <li><a href="#" className="text-white"><i className="fas fa-angle-right me-2" /> Attractions</a></li>
                  <li><a href="#" className="text-white"><i className="fas fa-angle-right me-2" /> Tickets</a></li>
                  <li><a href="#" className="text-white"><i className="fas fa-angle-right me-2" /> Blog</a></li>
                  <li><a href="#" className="text-white"><i className="fas fa-angle-right me-2" /> Contact us</a></li>
                </ul>
              </div>
            </div>

            {/* Footer Item 3 - Support Links */}
            <div className="col-md-6 col-lg-6 col-xl-3">
              <div className="footer-item">
                <h4 className="text-white mb-4">Support</h4>
                <ul className="list-unstyled">
                  <li><a href="#" className="text-white"><i className="fas fa-angle-right me-2" /> Privacy Policy</a></li>
                  <li><a href="#" className="text-white"><i className="fas fa-angle-right me-2" /> Terms &amp; Conditions</a></li>
                  <li><a href="#" className="text-white"><i className="fas fa-angle-right me-2" /> Disclaimer</a></li>
                  <li><a href="#" className="text-white"><i className="fas fa-angle-right me-2" /> Support</a></li>
                  <li><a href="#" className="text-white"><i className="fas fa-angle-right me-2" /> FAQ</a></li>
                  <li><a href="#" className="text-white"><i className="fas fa-angle-right me-2" /> Help</a></li>
                </ul>
              </div>
            </div>

            {/* Footer Item 4 - Contact Information */}
            <div className="col-md-6 col-lg-6 col-xl-3">
              <div className="footer-item">
                <h4 className="text-white mb-4">Contact Info</h4>
                <div className="d-flex align-items-center mb-3">
                  <i className="fas fa-map-marker-alt text-primary me-3" />
                  <p className="text-white mb-0">123 Street New York, USA</p>
                </div>
                <div className="d-flex align-items-center mb-3">
                  <i className="fas fa-envelope text-primary me-3" />
                  <p className="text-white mb-0">info@example.com</p>
                </div>
                <div className="d-flex align-items-center mb-3">
                  <i className="fa fa-phone-alt text-primary me-3" />
                  <p className="text-white mb-0">(+012) 3456 7890</p>
                </div>
                <div className="d-flex">
                  <a className="btn btn-primary btn-sm-square rounded-circle me-3" href="#"><i className="fab fa-facebook-f text-white" /></a>
                  <a className="btn btn-primary btn-sm-square rounded-circle me-3" href="#"><i className="fab fa-twitter text-white" /></a>
                  <a className="btn btn-primary btn-sm-square rounded-circle me-3" href="#"><i className="fab fa-instagram text-white" /></a>
                  <a className="btn btn-primary btn-sm-square rounded-circle" href="#"><i className="fab fa-linkedin-in text-white" /></a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer End */}

      {/* Copyright Section */}
      <div className="container-fluid copyright py-4">
        <div className="container">
          <div className="row g-4 align-items-center">
            <div className="col-md-6 text-center text-md-start mb-md-0">
              <span className="text-body">
                <a href="#" className="border-bottom text-white">
                  <i className="fas fa-copyright text-light me-2" /> Your Site Name
                </a>, All rights reserved.
              </span>
            </div>
            <div className="col-md-6 text-center text-md-end text-body">
              Designed By <a className="border-bottom text-white" href="https://htmlcodex.com">HTML Codex</a> Distributed By <a className="border-bottom text-white" href="https://themewagon.com">ThemeWagon</a>
            </div>
          </div>
        </div>
      </div>
      {/* Copyright Section End */}
    </div>
  );
}

export default Footer;
