import React from 'react';
import '../../styles/landing.css';
import aboutImage from '../../assets/landing/about-image.svg';

function About() {
  return (
    <section id="about" className="landing-about landing-section">
      <div className="container mx-auto px-6">
        <h2 className="section-title">About Us</h2>
        <p className="section-subtitle">
          Learn more about TuniBalance and our mission to simplify financial management for businesses and individuals.
        </p>

        <div className="landing-about-content">
          <div className="landing-about-image">
            <img
              src={aboutImage}
              alt="About TuniBalance"
              className="landing-about-img"
            />
          </div>

          <div className="landing-about-text">
            <h3 className="landing-about-title">Our Story</h3>
            <p className="landing-about-description">
              TuniBalance was founded in 2023 with a simple mission: to make financial management accessible to everyone.
              We believe that managing finances shouldn't be complicated or time-consuming.
            </p>
            <p className="landing-about-description">
              Our team of financial experts and software engineers has created a platform that simplifies accounting,
              invoicing, and financial reporting for businesses of all sizes. Whether you're a freelancer, small business owner,
              or managing a large enterprise, TuniBalance has the tools you need to succeed.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8">
              <div className="flex items-start gap-3">
                <div className="bg-primary-100 dark:bg-primary-900/30 p-2 rounded-full text-primary-600 dark:text-primary-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-lg font-semibold mb-1 text-gray-900 dark:text-white">User-Friendly</h4>
                  <p className="text-gray-600 dark:text-gray-300">Intuitive interface designed for users of all skill levels</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="bg-primary-100 dark:bg-primary-900/30 p-2 rounded-full text-primary-600 dark:text-primary-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-lg font-semibold mb-1 text-gray-900 dark:text-white">Affordable</h4>
                  <p className="text-gray-600 dark:text-gray-300">Flexible pricing plans to fit businesses of all sizes</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="bg-primary-100 dark:bg-primary-900/30 p-2 rounded-full text-primary-600 dark:text-primary-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-lg font-semibold mb-1 text-gray-900 dark:text-white">Secure</h4>
                  <p className="text-gray-600 dark:text-gray-300">Bank-level security to protect your financial data</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="bg-primary-100 dark:bg-primary-900/30 p-2 rounded-full text-primary-600 dark:text-primary-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-lg font-semibold mb-1 text-gray-900 dark:text-white">Reliable</h4>
                  <p className="text-gray-600 dark:text-gray-300">99.9% uptime and dedicated customer support</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;
