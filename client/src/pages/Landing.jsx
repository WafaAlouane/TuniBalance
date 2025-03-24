// Landing.jsx
import React from 'react';
import Header from '../components/Home/Header';
import Skills from '../components/Home/Skills';
import Clients from '../components/Home/Clients';
import Team from '../components/Home/Team';
import WhyUs from '../components/Home/WhyUs';
import Services from '../components/Home/Services';
import About from '../components/Home/About';
import Contact from '../components/Home/Contact';
import Footer from '../components/Home/Footer';
import Hero from '../components/Home/Hero';
function Landing() {
  return (
    <div>
    <Header />    
    <Hero />

    <Team /> 
    <About /> 
    <Services /> 
    <WhyUs /> 
    <Clients /> 
    <Skills />
    <Contact /> 
    <Footer /> 


   
    </div>
  );
}

export default Landing;
