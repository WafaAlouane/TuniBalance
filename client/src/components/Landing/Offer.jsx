import React from 'react';

function Offer() {
  const offers = [
    { id: "collapseOne", img: "assets/img/offer-1.jpg", title: "Lending money for investment of your new projects" },
    { id: "collapseTwo", img: "assets/img/offer-2.jpg", title: "Flexible funding solutions for business expansion" },
    { id: "collapseThree", img: "assets/img/offer-3.jpg", title: "Mobile payments for seamless transactions" },
    { id: "collapseFour", img: "assets/img/offer-4.jpg", title: "Zero transaction fees for pro traders" },
  ];

  return (
    <div className="container-fluid offer-section pb-5">
      <div className="container pb-5">
        <div className="text-center mx-auto pb-5 wow fadeInUp" data-wow-delay="0.2s" style={{ maxWidth: 800 }}>
          <h4 className="text-primary">Our Offer</h4>
          <h1 className="display-5 mb-4">Benefits We Offer</h1>
          <p className="mb-0">
            Discover the exclusive benefits we provide to help investors and businesses thrive in a competitive market.
          </p>
        </div>
        <div className="row g-5 align-items-center">
          <div className="col-xl-5 wow fadeInLeft" data-wow-delay="0.2s">
            <div className="nav nav-pills bg-light rounded p-5">
              {offers.map((offer, index) => (
                <a key={index} className={`accordion-link p-4 ${index === 0 ? 'active' : ''} mb-4`} data-bs-toggle="pill" href={`#${offer.id}`}>
                  <h5 className="mb-0">{offer.title}</h5>
                </a>
              ))}
            </div>
          </div>
          <div className="col-xl-7 wow fadeInRight" data-wow-delay="0.4s">
            <div className="tab-content">
              {offers.map((offer, index) => (
                <div key={index} id={offer.id} className={`tab-pane fade ${index === 0 ? 'show active' : ''} p-0`}>
                  <div className="row g-4">
                    <div className="col-md-7">
                      <img src={offer.img} className="img-fluid w-100 rounded" alt={offer.title} />
                    </div>
                    <div className="col-md-5">
                      <h1 className="display-5 mb-4">{offer.title}</h1>
                      <p className="mb-4">
                        Our tailored financial solutions ensure that your investments and transactions are seamless, cost-effective, and efficient.
                      </p>
                      <a className="btn btn-primary rounded-pill py-2 px-4" href="#">Learn More</a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Offer;
