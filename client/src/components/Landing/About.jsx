import React from 'react'

function About() {
  return (
    <div>
     {/* About Start */}
<div className="container-fluid about py-5">
  <div className="container py-5">
    <div className="row g-5 align-items-center">
      <div className="col-xl-7 wow fadeInLeft" data-wow-delay="0.2s" style={{visibility: 'visible', animationDelay: '0.2s', animationName: 'fadeInLeft'}}>
        <div>
          <h4 className="text-primary">About Us</h4>
          <h1 className="display-5 mb-4">Meet our company unless miss the opportunity</h1>
          <p className="mb-4">Lorem, ipsum dolor sit amet consectetur adipisicing elit. Cum velit temporibus repudiandae ipsa, eaque perspiciatis cumque incidunt tenetur sequi reiciendis.
          </p>
          <div className="row g-4">
            <div className="col-md-6 col-lg-6 col-xl-6">
              <div className="d-flex">
                <div><i className="fas fa-lightbulb fa-3x text-primary" /></div>
                <div className="ms-4">
                  <h4>Business Consuluting</h4>
                  <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit.</p>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-lg-6 col-xl-6">
              <div className="d-flex">
                <div><i className="bi bi-bookmark-heart-fill fa-3x text-primary" /></div>
                <div className="ms-4">
                  <h4>Year Of Expertise</h4>
                  <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit.</p>
                </div>
              </div>
            </div>
            <div className="col-sm-6">
              <a href="#" className="btn btn-primary rounded-pill py-3 px-5 flex-shrink-0">Discover Now</a>
            </div>
            <div className="col-sm-6">
              <div className="d-flex">
                <i className="fas fa-phone-alt fa-2x text-primary me-4" />
                <div>
                  <h4>Call Us</h4>
                  <p className="mb-0 fs-5" style={{letterSpacing: 1}}>+01234567890</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="col-xl-5 wow fadeInRight" data-wow-delay="0.2s" style={{visibility: 'visible', animationDelay: '0.2s', animationName: 'fadeInRight'}}>
        <div className="bg-primary rounded position-relative overflow-hidden">
          <img src="assets/img/about-2.png" className="img-fluid rounded w-100" alt />
          <div className style={{position: 'absolute', top: '-15px', right: '-15px'}}>
            <img src="assets/img/about-3.png" className="img-fluid" style={{width: 150, height: 150, opacity: '0.7'}} alt />
          </div>
          <div className style={{position: 'absolute', top: '-20px', left: 10, transform: 'rotate(90deg)'}}>
            <img src="assets/img/about-4.png" className="img-fluid" style={{width: 100, height: 150, opacity: '0.9'}} alt />
          </div>
          <div className="rounded-bottom">
            <img src="assets/img/about-5.jpg" className="img-fluid rounded-bottom w-100" alt />
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
{/* About End */}

    </div>
  )
}

export default About