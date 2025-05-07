import React from 'react';
import '../../styles/landing.css';
import serviceFinancial from '../../assets/landing/service-financial.svg';
import serviceTax from '../../assets/landing/service-tax.svg';
import servicePlanning from '../../assets/landing/service-planning.svg';

function Services() {
  const services = [
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      img: serviceFinancial,
      title: 'Financial Analysis',
      description: 'Get detailed financial analysis and insights to make informed business decisions.'
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      img: serviceTax,
      title: 'Tax Planning',
      description: 'Optimize your tax strategy and ensure compliance with all regulations.'
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      img: servicePlanning,
      title: 'Financial Planning',
      description: 'Create comprehensive financial plans to achieve your short and long-term goals.'
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z" />
        </svg>
      ),
      title: 'Payroll Management',
      description: 'Streamline your payroll process and ensure accurate and timely payments to employees.'
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      title: 'Risk Management',
      description: 'Identify and mitigate financial risks to protect your business and investments.'
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
      title: 'Investment Advisory',
      description: 'Get expert advice on investments to maximize returns and achieve financial goals.'
    }
  ];

  return (
    <section id="services" className="landing-services landing-section">
      <div className="container mx-auto px-6">
        <h2 className="section-title">Our Services</h2>
        <p className="section-subtitle">
          We offer a wide range of financial services to help you manage your finances effectively.
        </p>

        <div className="landing-services-grid">
          {services.map((service, index) => (
            <div key={index} className="landing-service-card">
              {service.img && (
                <div className="landing-service-image mb-4">
                  <img src={service.img} alt={service.title} className="w-full h-40 object-contain rounded-lg" />
                </div>
              )}
              <div className="landing-service-icon">
                {service.icon}
              </div>
              <h3 className="landing-service-title">{service.title}</h3>
              <p className="landing-service-description">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Services;