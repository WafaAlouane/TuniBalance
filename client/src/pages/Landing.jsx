// Landing.jsx
import React from 'react';
import Header from '../components/Home/Header';
import Features from '../components/Home/Features';
import About from '../components/Home/About';
import Services from '../components/Home/Services';
import Team from '../components/Home/Team';
import Contact from '../components/Home/Contact';
import Footer from '../components/Home/Footer';
import Hero from '../components/Home/Hero';
import '../styles/landing.css';

function Landing() {
  return (
    <div className="landing-page">
      <Header />
      <main>
        <Hero />
        <Features />
        <About />
        <Services />
        <Team />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}

export default Landing;
