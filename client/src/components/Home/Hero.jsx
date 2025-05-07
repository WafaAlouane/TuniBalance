import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/landing.css';
import heroImage from '../../assets/landing/hero-image.svg';

function Hero() {
  return (
    <section id="hero" className="landing-hero">
      <div className="container mx-auto px-6">
        <div className="landing-hero-content">
          <div className="landing-hero-text animate-fade-in-up">
            <h1 className="landing-hero-title">
              Better Solutions <span className="text-primary-600 dark:text-primary-400">For Your Business</span>
            </h1>
            <p className="landing-hero-subtitle">
              TuniBalance helps businesses and individuals track expenses, manage invoices, and gain financial insights with our powerful yet simple accounting platform.
            </p>
            <div className="landing-hero-buttons">
              <Link to="/register" className="landing-button landing-button-primary">
                Get Started
              </Link>
              <a
                href="#"
                className="flex items-center gap-2 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Watch Demo</span>
              </a>
            </div>
          </div>

          <div className="landing-hero-image animate-fade-in-right">
            <img
              src={heroImage}
              alt="TuniBalance Dashboard"
              className="landing-hero-img"
            />
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-1/4 left-10 w-12 h-12 rounded-full bg-primary-200 dark:bg-primary-900/20 animate-float opacity-70"></div>
      <div className="absolute bottom-1/4 right-10 w-20 h-20 rounded-full bg-secondary-200 dark:bg-secondary-900/20 animate-float-delay opacity-70"></div>
      <div className="absolute top-3/4 left-1/3 w-8 h-8 rounded-full bg-primary-300 dark:bg-primary-800/20 animate-float-slow opacity-50"></div>
    </section>
  );
}

export default Hero