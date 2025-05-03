import React, { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"

const FAQ = () => {
  const [openItem, setOpenItem] = useState(0)

  const faqs = [
    {
      question: "How secure is my financial data on your platform?",
      answer:
        "Your data security is our top priority. We use bank-level 256-bit encryption, secure data centers, regular security audits, and comply with industry standards like SOC 2. All data is backed up daily, and we offer two-factor authentication for additional account security."
    },
    {
      question: "Can I import data from my existing accounting software?",
      answer:
        "Yes, our platform supports seamless data migration from most popular accounting software including QuickBooks, Xero, FreshBooks, and Sage. We provide migration tools and dedicated support to ensure a smooth transition without data loss."
    },
    {
      question: "Do you offer integrations with other business tools?",
      answer:
        "We integrate with a wide range of business tools including payment processors (Stripe, PayPal), banking institutions, CRM systems (Salesforce, HubSpot), e-commerce platforms (Shopify, WooCommerce), and productivity suites (Google Workspace, Microsoft 365)."
    },
    {
      question: "What kind of support do you offer?",
      answer:
        "We provide multiple support channels including email, live chat, and phone support during business hours. Professional and Enterprise plans include priority support with faster response times. Our knowledge base is available 24/7 with detailed guides and video tutorials."
    },
    {
      question: "Is there a mobile app available?",
      answer:
        "Yes, we offer mobile apps for both iOS and Android devices. The mobile app allows you to create and send invoices, capture receipts, track expenses, view financial reports, and manage clients while on the go."
    },
    {
      question: "How do you handle tax regulations for different countries?",
      answer:
        "Our platform is regularly updated to comply with tax regulations in supported countries. We offer country-specific tax templates, automatic tax calculations, and reporting features designed to meet local requirements. For specialized tax situations, we recommend consulting with a tax professional."
    }
  ]

  const toggleItem = index => {
    setOpenItem(openItem === index ? null : index)
  }

  return (
    <section id="faq" className="py-20 bg-gray-50">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-base font-semibold uppercase tracking-wide text-teal-600">
            FAQ
          </h2>
          <p className="mt-2 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Frequently Asked Questions
          </p>
          <p className="mt-4 text-xl text-gray-500">
            Everything you need to know about our accounting platform.
          </p>
        </div>

        <div className="divide-y divide-gray-200 rounded-xl bg-white shadow-sm">
          {faqs.map((faq, index) => (
            <div key={index} className="overflow-hidden">
              <button
                className="flex w-full items-center justify-between px-6 py-5 text-left focus:outline-none"
                onClick={() => toggleItem(index)}
              >
                <h3 className="text-lg font-medium text-gray-900">
                  {faq.question}
                </h3>
                {openItem === index ? (
                  <ChevronUp className="h-5 w-5 text-teal-600" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-500" />
                )}
              </button>

              <div
                className={`transition-all duration-300 ease-in-out overflow-hidden ${
                  openItem === index
                    ? "max-h-96 opacity-100"
                    : "max-h-0 opacity-0"
                }`}
              >
                <div className="px-6 pb-5 pt-0">
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-600">
            Still have questions?{" "}
            <a
              href="#"
              className="font-medium text-teal-600 hover:text-teal-700"
            >
              Contact our support team
            </a>
          </p>
        </div>
      </div>
    </section>
  )
}

export default FAQ
