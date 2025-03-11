import React from 'react';

function About() {
  return (
    <div>
      {/* About Section */}
      <section id="about" className="about section">
        <div className="container section-title" data-aos="fade-up">
          <h2>About Us</h2>
        </div>
        <div className="container">
          <div className="row gy-4">
            <div className="col-lg-6 content" data-aos="fade-up" data-aos-delay={100}>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
                magna aliqua.
              </p>
              <ul>
                <li><i className="bi bi-check2-circle" /> <span>Ullamco laboris nisi ut aliquip ex ea commodo consequat.</span></li>
                <li><i className="bi bi-check2-circle" /> <span>Duis aute irure dolor in reprehenderit in voluptate velit.</span></li>
                <li><i className="bi bi-check2-circle" /> <span>Ullamco laboris nisi ut aliquip ex ea commodo</span></li>
              </ul>
            </div>
            <div className="col-lg-6" data-aos="fade-up" data-aos-delay={200}>
              <p>
                Ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
                velit esse cillum dolore eu fugiat nulla pariatur.
              </p>
              <a href="#more-info" className="read-more">
                <span>Read More</span><i className="bi bi-arrow-right" />
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default About;
