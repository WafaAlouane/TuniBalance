import React, { useState } from "react"
import PricingCard from "./PricingCard"

const Pricing = () => {
  const [annual, setAnnual] = useState(true)

  const plans = [
    {
      name: "Starter",
      description: "Perfect for freelancers and small businesses",
      price: annual ? 9 : 12,
      frequency: annual ? "/month, billed annually" : "/month",
      features: [
        "Expense tracking",
        "Basic financial reports",
        "Up to 20 clients",
        "Invoice generation",
        "Bank account connection",
        "Mobile app access"
      ],
      cta: "Get Started",
      popular: false
    },
    {
      name: "Professional",
      description: "Ideal for growing businesses",
      price: annual ? 29 : 39,
      frequency: annual ? "/month, billed annually" : "/month",
      features: [
        "Everything in Starter, plus:",
        "Unlimited clients",
        "Advanced financial reports",
        "Customizable dashboards",
        "Tax preparation tools",
        "Team access (up to 3 users)",
        "Client portal",
        "Payment processing"
      ],
      cta: "Get Started",
      popular: true
    },
    {
      name: "Enterprise",
      description: "For established businesses with complex needs",
      price: annual ? 79 : 99,
      frequency: annual ? "/month, billed annually" : "/month",
      features: [
        "Everything in Professional, plus:",
        "Unlimited team members",
        "Custom roles & permissions",
        "Advanced analytics",
        "API access",
        "Dedicated account manager",
        "Custom integrations",
        "Priority support"
      ],
      cta: "Contact Sales",
      popular: false
    }
  ]

  return (
    <section id="pricing" className="py-20 bg-gray-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center mb-16">
          <h2 className="text-base font-semibold uppercase tracking-wide text-teal-600">
            Pricing
          </h2>
          <p className="mt-2 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Plans for businesses of all sizes
          </p>
          <p className="mt-4 text-xl text-gray-500">
            Choose the perfect plan for your needs. All plans include a 14-day
            free trial.
          </p>

          {/* Toggle */}
          <div className="mt-8 flex justify-center">
            <div className="relative overflow-hidden rounded-full p-0.5">
              <div className="flex items-center">
                <span
                  className={`mr-2 py-2 px-4 text-sm font-medium ${
                    annual ? "text-teal-600" : "text-gray-500"
                  }`}
                >
                  Annual (20% off)
                </span>
                <button
                  type="button"
                  className="relative inline-flex h-8 w-14 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-gray-200 transition-colors duration-200 ease-in-out focus:outline-none"
                  role="switch"
                  aria-checked={!annual}
                  onClick={() => setAnnual(!annual)}
                >
                  <span className="sr-only">Use setting</span>
                  <span
                    aria-hidden="true"
                    className={`pointer-events-none inline-block h-7 w-7 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      annual ? "translate-x-0" : "translate-x-6"
                    }`}
                  ></span>
                </button>
                <span
                  className={`ml-2 py-2 px-4 text-sm font-medium ${
                    !annual ? "text-teal-600" : "text-gray-500"
                  }`}
                >
                  Monthly
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid max-w-lg gap-8 mx-auto lg:max-w-none lg:grid-cols-3">
          {plans.map((plan, index) => (
            <PricingCard
              key={index}
              name={plan.name}
              description={plan.description}
              price={plan.price}
              frequency={plan.frequency}
              features={plan.features}
              cta={plan.cta}
              popular={plan.popular}
            />
          ))}
        </div>

        <div className="mt-16 bg-white rounded-2xl p-8 shadow-sm">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">
            Frequently Asked Questions
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                question: "Can I change plans later?",
                answer:
                  "Yes, you can upgrade or downgrade your plan at any time. Changes take effect at the start of your next billing cycle."
              },
              {
                question: "Is there a setup fee?",
                answer:
                  "No, there are no hidden fees or setup costs. You only pay for your subscription plan."
              },
              {
                question: "What payment methods do you accept?",
                answer:
                  "We accept major credit cards, PayPal, and bank transfers for annual plans."
              },
              {
                question: "Can I cancel my subscription?",
                answer:
                  "Yes, you can cancel your subscription at any time from your account settings."
              }
            ].map((faq, index) => (
              <div key={index} className="border-b border-gray-200 pb-4">
                <h4 className="text-base font-medium text-gray-900 mb-2">
                  {faq.question}
                </h4>
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Pricing
