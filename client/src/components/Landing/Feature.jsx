import React from 'react';

// Composant pour un élément de fonctionnalité
const FeatureItem = ({ icon, title, description, delay }) => {
  return (
    <div className="col-md-6 col-lg-6 col-xl-3 wow fadeInUp" data-wow-delay={delay}>
      <div className="feature-item p-4">
        <div className="feature-icon p-4 mb-4">
          <i className={`${icon} fa-4x text-primary`} />
        </div>
        <h4>{title}</h4>
        <p className="mb-4">{description}</p>
        <a className="btn btn-primary rounded-pill py-2 px-4" href="#">Learn More</a>
      </div>
    </div>
  );
};

function Feature() {
  return (
    <div>
      {/* Features Start */}
      <div className="container-fluid feature pb-5">
        <div className="container pb-5">
          <div className="text-center mx-auto pb-5 wow fadeInUp" data-wow-delay="0.2s">
            <h4 className="text-primary">Our Features</h4>
            <h1 className="display-5 mb-4">Connecting businesses, ideas, and people for greater impact.</h1>
            <p className="mb-0">
              Lorem ipsum dolor, sit amet consectetur adipisicing elit. Tenetur adipisci facilis cupiditate
              recusandae aperiam temporibus corporis itaque quis facere, numquam, ad culpa deserunt sint dolorem autem
              obcaecati, ipsam mollitia hic.
            </p>
          </div>

          {/* Feature Items */}
          <div className="row g-4">
            <FeatureItem
              icon="fas fa-chart-line"
              title="Global Management"
              description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Ea hic laborum odit pariatur..."
              delay="0.2s"
            />
            <FeatureItem
              icon="fas fa-university"
              title="Corporate Banking"
              description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Ea hic laborum odit pariatur..."
              delay="0.4s"
            />
            <FeatureItem
              icon="fas fa-file-alt"
              title="Asset Management"
              description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Ea hic laborum odit pariatur..."
              delay="0.6s"
            />
            <FeatureItem
              icon="fas fa-hand-holding-usd"
              title="Investment Bank"
              description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Ea hic laborum odit pariatur..."
              delay="0.8s"
            />
          </div>
        </div>
      </div>
      {/* Features End */}
    </div>
  );
}

export default Feature;
