import React, { useState, useEffect } from "react"
import { Menu, X, ChevronDown, BarChart } from "lucide-react"
import AuthModal from "./AuthModal"

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [authType, setAuthType] = useState("login")

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const openLoginModal = () => {
    setAuthType("login")
    setIsAuthModalOpen(true)
  }

  const openSignupModal = () => {
    setAuthType("signup")
    setIsAuthModalOpen(true)
  }

  return (
    <>
      <header
        className={`fixed w-full z-30 transition-all duration-300 ${
          isScrolled ? "bg-white shadow-md py-2" : "bg-transparent py-4"
        }`}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <div className="flex items-center">
              <BarChart className="h-8 w-8 text-teal-600" />
              <span className="ml-2 text-xl font-bold text-slate-800">
                TunisBalance
              </span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <a
                href="#features"
                className="text-slate-700 hover:text-teal-600 transition-colors duration-200"
              >
                Features
              </a>
              <a
                href="#pricing"
                className="text-slate-700 hover:text-teal-600 transition-colors duration-200"
              >
                Pricing
              </a>
              <a
                href="#testimonials"
                className="text-slate-700 hover:text-teal-600 transition-colors duration-200"
              >
                Testimonials
              </a>
              <div className="relative group">
                <button className="flex items-center text-slate-700 hover:text-teal-600 transition-colors duration-200">
                  Resources
                  <ChevronDown className="ml-1 h-4 w-4" />
                </button>
                <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform">
                  <div className="py-1">
                    <a
                      href="#"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Documentation
                    </a>
                    <a
                      href="#"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      API Reference
                    </a>
                    <a
                      href="#"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Help Center
                    </a>
                  </div>
                </div>
              </div>
            </nav>

            {/* Auth Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              <button
                onClick={openLoginModal}
                className="text-slate-800 hover:text-teal-600 font-medium transition-colors duration-200"
              >
                Login
              </button>
              <button
                onClick={openSignupModal}
                className="px-4 py-2 rounded-md bg-teal-600 text-white font-medium hover:bg-teal-700 transition-colors duration-200 shadow-sm"
              >
                Sign Up
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-slate-800 hover:text-teal-600 transition-colors duration-200"
              >
                {isMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <a
                href="#features"
                className="block px-3 py-2 text-base font-medium text-slate-700 hover:text-teal-600 hover:bg-gray-50 rounded-md"
                onClick={() => setIsMenuOpen(false)}
              >
                Features
              </a>
              <a
                href="#pricing"
                className="block px-3 py-2 text-base font-medium text-slate-700 hover:text-teal-600 hover:bg-gray-50 rounded-md"
                onClick={() => setIsMenuOpen(false)}
              >
                Pricing
              </a>
              <a
                href="#testimonials"
                className="block px-3 py-2 text-base font-medium text-slate-700 hover:text-teal-600 hover:bg-gray-50 rounded-md"
                onClick={() => setIsMenuOpen(false)}
              >
                Testimonials
              </a>
              <a
                href="#"
                className="block px-3 py-2 text-base font-medium text-slate-700 hover:text-teal-600 hover:bg-gray-50 rounded-md"
              >
                Resources
              </a>
              <div className="mt-4 pt-4 border-t border-gray-200 flex flex-col space-y-3">
                <button
                  onClick={() => {
                    openLoginModal()
                    setIsMenuOpen(false)
                  }}
                  className="px-3 py-2 text-base font-medium text-teal-600 hover:bg-gray-50 rounded-md text-left"
                >
                  Login
                </button>
                <button
                  onClick={() => {
                    openSignupModal()
                    setIsMenuOpen(false)
                  }}
                  className="px-3 py-2 text-base font-medium bg-teal-600 text-white hover:bg-teal-700 rounded-md text-left"
                >
                  Sign Up
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        authType={authType}
        setAuthType={setAuthType}
      />
    </>
  )
}

export default Navbar
