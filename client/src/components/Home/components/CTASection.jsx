import React from "react"
import { ArrowRight, Check } from "lucide-react"

const CTASection = () => {
  return (
    <section className="py-20 bg-gradient-to-r from-slate-900 to-slate-800 overflow-hidden relative">
      {/* Decorative elements */}
      <div className="absolute -top-24 right-0 h-96 w-96 rounded-full bg-teal-500 opacity-10 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-indigo-500 opacity-10 blur-3xl"></div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Ready to transform your financial management?
          </h2>
          <p className="mt-4 text-xl text-gray-300">
            Join thousands of businesses that have simplified their accounting
            processes with our platform.
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 md:p-12 shadow-xl border border-white/20">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-2 items-center">
            <div>
              <h3 className="text-2xl font-bold text-white mb-6">
                Start your free 14-day trial
              </h3>
              <p className="text-gray-300 mb-8">
                Experience all the features with no credit card required. Cancel
                anytime.
              </p>

              <ul className="space-y-4 mb-8">
                {[
                  "Full access to all features",
                  "Unlimited transactions",
                  "Email and chat support",
                  "No credit card required"
                ].map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <Check className="h-5 w-5 text-teal-400 mt-0.5 flex-shrink-0" />
                    <span className="ml-3 text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <button className="group inline-flex items-center justify-center rounded-md bg-teal-600 px-6 py-3 text-base font-medium text-white shadow-lg shadow-teal-500/20 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:ring-offset-slate-900 transition-all duration-200">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-200 group-hover:translate-x-1" />
                </button>

                <button className="inline-flex items-center justify-center rounded-md border border-white/30 bg-transparent px-6 py-3 text-base font-medium text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-slate-900 transition-all duration-200">
                  Watch Demo
                </button>
              </div>
            </div>

            <div className="space-y-6 md:border-l md:border-white/20 md:pl-12">
              <div>
                <p className="text-2xl font-bold text-white mb-2">97%</p>
                <p className="text-gray-300">
                  of customers report significant time savings on accounting
                  tasks
                </p>
              </div>

              <div>
                <p className="text-2xl font-bold text-white mb-2">$15,000+</p>
                <p className="text-gray-300">
                  average annual savings for small businesses
                </p>
              </div>

              <div>
                <p className="text-2xl font-bold text-white mb-2">98.7%</p>
                <p className="text-gray-300">customer satisfaction rating</p>
              </div>

              <div className="pt-4">
                <div className="text-sm text-gray-400">
                  Trusted by leading companies worldwide:
                </div>
                <div className="mt-3 flex space-x-6">
                  {["Acme", "TechCorp", "GlobalFin", "FutureCo"].map(
                    (company, index) => (
                      <div
                        key={index}
                        className="text-white font-semibold opacity-70"
                      >
                        {company}
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default CTASection
