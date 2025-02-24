import React from 'react';

function Service() {
  const services = [
    { img: "assets/img/service-1.jpg", title: "Strategy Consulting" },
    { img: "assets/img/service-2.jpg", title: "Financial Advisory" },
    { img: "assets/img/service-3.jpg", title: "Management Consulting" },
    { img: "assets/img/service-4.jpg", title: "Supply Optimization" },
    { img: "assets/img/service-5.jpg", title: "HR Consulting" },
    { img: "assets/img/service-6.jpg", title: "Marketing Consulting" },
  ];

  return (
    <div className="container-fluid service pb-5">
      <div className="container pb-5">
        <div className="text-center mx-auto pb-5 wow fadeInUp" data-wow-delay="0.2s" style={{ maxWidth: 800 }}>
          <h4 className="text-primary">Our Services</h4>
          <h1 className="display-5 mb-4">We Provide the Best Services</h1>
          <p className="mb-0">
            We offer expert guidance in various industries to optimize your business strategies, 
            improve efficiency, and maximize success.
          </p>
        </div>
        <div className="row g-4">
          {services.map((service, index) => (
            <div key={index} className="col-md-6 col-lg-4 wow fadeInUp" data-wow-delay={`${0.2 + index * 0.2}s`}>
              <div className="service-item">
                <div className="service-img">
                  <img src={service.img} className="img-fluid rounded-top w-100" alt={service.title} />
                </div>
                <div className="rounded-bottom p-4">
                  <a href="#" className="h4 d-inline-block mb-4">{service.title}</a>
                  <p className="mb-4">
                    We provide expert advice and strategies to help businesses grow, optimize operations, and enhance their market position.
                  </p>
                  <a className="btn btn-primary rounded-pill py-2 px-4" href="#">Learn More</a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Service;
