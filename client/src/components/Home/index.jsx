import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import Pricing from './components/Pricing';
import Testimonials from './components/Testimonials';
import FAQ from './components/FAQ';
import CTASection from './components/CTASection';
import { useLocation } from 'react-router-dom'
import Footer from './components/Footer';
import React, { useEffect, useState } from 'react'
import AuthModal from '../Home/components/AuthModal'



function Home() {
  const location = useLocation()
  const [modalOpen, setModalOpen] = useState(false)
  const [authType, setAuthType] = useState('login')

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const token = params.get('token')
    if (token) {
      setAuthType('resetPassword')
      setModalOpen(true)
    }
  }, [location.search])

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div>
      {/* Your home content, or switch on path for /login /register etc */}
      {/* Always render the AuthModal so it can pop up */}
      <AuthModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        authType={authType}
        setAuthType={setAuthType}
      />
    </div>
      <Hero />
      <Features />
      <Pricing />
      <Testimonials />
      <FAQ />
      <CTASection />
      <Footer />
    </div>
  );
}

export default Home;