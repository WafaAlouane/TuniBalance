// Landing.jsx
import React from 'react';
import Navbar from '../components/Landing/Navbar';
import About from '../components/Landing/About';
import Feature from '../components/Landing/Feature';
import Offer from '../components/Landing/Offer';
import Blog from '../components/Landing/Blog';
import FAQ from '../components/Landing/FAQ';
import Team from '../components/Landing/Team';
import Testimonia from '../components/Landing/Testimonia';
import Footer from '../components/Landing/Footer';
import Service from '../components/Landing/Service';


function Landing() {
  return (
    <div>
      
      <Navbar />
      <section id="home">
        {/* Home content here */}
      </section>
      <section id="about">
        <About />
      </section>
      <section id="services">
        <Service />
      </section>
      <section id="features">
        <Feature />
      </section>
      <section id="offer">
        <Offer />
      </section>
      <section id="blog">
        <Blog />
      </section>
      <section id="faq">
        <FAQ />
      </section>
      <section id="team">
        <Team />
      </section>
      <section id="testimonial">
        <Testimonia />
      </section>
      <Footer />
    </div>
  );
}

export default Landing;
