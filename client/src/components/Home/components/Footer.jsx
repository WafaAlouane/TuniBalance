import React from "react"
import { BarChart, Facebook, Twitter, Instagram, Linkedin, Mail, MapPin, Phone } from 'lucide-react';


const Footer = () => {
  const currentYear = new Date().getFullYear()

  const footerLinks = [
    {
      title: "Product",
      links: [
        { name: "Features", href: "#features" },
        { name: "Pricing", href: "#pricing" },
        { name: "Testimonials", href: "#testimonials" },
        { name: "FAQ", href: "#faq" }
      ]
    },
    {
      title: "Resources",
      links: [
        { name: "Documentation", href: "#" },
        { name: "API Reference", href: "#" },
        { name: "Blog", href: "#" },
        { name: "Community", href: "#" }
      ]
    },
    {
      title: "Company",
      links: [
        { name: "About Us", href: "#" },
        { name: "Careers", href: "#" },
        { name: "Press", href: "#" },
        { name: "Contact Us", href: "#" }
      ]
    },
    {
      title: "Legal",
      links: [
        { name: "Privacy Policy", href: "#" },
        { name: "Terms of Service", href: "#" },
        { name: "Security", href: "#" },
        { name: "Compliance", href: "#" }
      ]
    }
  ]

  return (
    <footer className="bg-slate-900 text-white">
      <div className="mx-auto max-w-7xl px-4 pt-16 pb-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand column */}
          <div className="lg:col-span-1">
            <div className="flex items-center">
              <BarChart className="h-8 w-8 text-teal-500" />
              <span className="ml-2 text-xl font-bold"></span>
            </div>
            <p className="mt-4 text-sm text-gray-400 max-w-xs">
              Empowering businesses with intelligent financial management
              solutions since 2020.
            </p>
            <div className="mt-6">
              <h3 className="text-sm font-semibold text-gray-300">Follow Us</h3>
              <div className="mt-2 flex space-x-4">
                <a
                  href="#"
                  className="text-gray-400 hover:text-teal-400 transition-colors"
                >
                  <Facebook className="h-5 w-5" />
                  <span className="sr-only">Facebook</span>
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-teal-400 transition-colors"
                >
                  <Twitter className="h-5 w-5" />
                  <span className="sr-only">Twitter</span>
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-teal-400 transition-colors"
                >
                  <Instagram className="h-5 w-5" />
                  <span className="sr-only">Instagram</span>
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-teal-400 transition-colors"
                >
                  <Linkedin className="h-5 w-5" />
                  <span className="sr-only">LinkedIn</span>
                </a>
              </div>
            </div>
          </div>

          {/* Links columns */}
          {footerLinks.map(column => (
            <div key={column.title}>
              <h3 className="text-sm font-semibold text-gray-300">
                {column.title}
              </h3>
              <ul className="mt-4 space-y-3">
                {column.links.map(link => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-sm text-gray-400 hover:text-teal-400 transition-colors duration-200"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Contact info */}
        <div className="mt-12 border-t border-gray-800 pt-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="flex items-start">
              <MapPin className="h-5 w-5 text-teal-500 mt-0.5 flex-shrink-0" />
              <span className="ml-3 text-sm text-gray-400">
                123 Finance Street, Suite 100
                <br />
                San Francisco, CA 94103
              </span>
            </div>
            <div className="flex items-start">
              <Phone className="h-5 w-5 text-teal-500 mt-0.5 flex-shrink-0" />
              <span className="ml-3 text-sm text-gray-400">
                +1 (555) 123-4567
              </span>
            </div>
            <div className="flex items-start">
              <Mail className="h-5 w-5 text-teal-500 mt-0.5 flex-shrink-0" />
              <span className="ml-3 text-sm text-gray-400">
                support@TunisBalance.com
              </span>
            </div>
          </div>
        </div>

        {/* Bottom copyright and legal */}
        <div className="mt-12 border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-400">
            &copy; {currentYear} TunisBalance. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0 flex space-x-6">
            <a
              href="#"
              className="text-xs text-gray-400 hover:text-teal-400 transition-colors"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="text-xs text-gray-400 hover:text-teal-400 transition-colors"
            >
              Terms of Service
            </a>
            <a
              href="#"
              className="text-xs text-gray-400 hover:text-teal-400 transition-colors"
            >
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
