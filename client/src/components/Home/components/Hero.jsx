import React from "react"
import { ArrowRight } from "lucide-react"

const Hero = () => {
  return (
    <div className="relative overflow-hidden bg-slate-900 pt-16">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"></div>

      {/* Radial gradient accent */}
      <div className="absolute -top-24 right-0 h-[500px] w-[500px] rounded-full bg-teal-500 opacity-10 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 h-[400px] w-[400px] rounded-full bg-indigo-500 opacity-10 blur-3xl"></div>

      {/* Hero content */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 md:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="max-w-2xl">
            <div className="mb-6 inline-flex items-center rounded-full bg-slate-800/80 px-4 py-1.5 text-sm font-medium text-teal-400 backdrop-blur-sm">
              <span className="mr-2">✨</span>
              Simplified accounting for modern businesses
            </div>

            <h1 className="mb-6 text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Manage finances{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-teal-500">
                with confidence
              </span>
            </h1>

            <p className="mb-8 text-xl text-slate-300 leading-relaxed">
              Streamline your accounting workflow, gain financial clarity, and
              make strategic decisions with our intuitive management platform.
            </p>

            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <button className="group inline-flex items-center justify-center rounded-md bg-teal-600 px-6 py-3 text-base font-medium text-white shadow-lg shadow-teal-500/20 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:ring-offset-slate-900 transition-all duration-200">
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-200 group-hover:translate-x-1" />
              </button>

              <button className="inline-flex items-center justify-center rounded-md border border-slate-700 bg-slate-800/50 px-6 py-3 text-base font-medium text-white backdrop-blur-sm hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:ring-offset-slate-900 transition-all duration-200">
                Watch Demo
              </button>
            </div>

            <div className="mt-10 flex items-center">
              <div className="flex -space-x-2">
                {[...Array(4)].map((_, i) => (
                  <img
                    key={i}
                    className="inline-block h-8 w-8 rounded-full ring-2 ring-slate-900"
                    src={`https://randomuser.me/api/portraits/men/${20 +
                      i}.jpg`}
                    alt=""
                  />
                ))}
              </div>
              <div className="ml-3 text-sm font-medium text-slate-400">
                Trusted by <span className="text-teal-400">10,000+</span>{" "}
                businesses worldwide
              </div>
            </div>
          </div>

          <div className="relative lg:block">
            <div className="relative mx-auto w-full max-w-lg">
              {/* Decorative elements */}
              <div className="absolute -top-4 -left-4 h-72 w-72 rounded-full bg-teal-400 opacity-30 mix-blend-multiply blur-3xl"></div>
              <div className="absolute -bottom-4 -right-4 h-72 w-72 rounded-full bg-indigo-400 opacity-30 mix-blend-multiply blur-3xl"></div>

              {/* Dashboard mockup */}
              <div className="relative rounded-xl bg-slate-800 p-2 shadow-2xl shadow-slate-900/50 ring-1 ring-slate-700/50 backdrop-blur-sm">
                <div className="rounded-lg bg-slate-900 overflow-hidden">
                  <div className="flex items-center border-b border-slate-700/60 bg-slate-800/80 px-4 py-2">
                    <div className="flex space-x-1.5">
                      <div className="h-3 w-3 rounded-full bg-red-400"></div>
                      <div className="h-3 w-3 rounded-full bg-amber-400"></div>
                      <div className="h-3 w-3 rounded-full bg-green-400"></div>
                    </div>
                    <div className="mx-auto text-sm font-medium text-slate-400">
                      Financial Dashboard
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="mb-6 flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-white">
                        Financial Overview
                      </h3>
                      <div className="rounded-md bg-teal-600/20 px-2.5 py-1 text-xs font-medium text-teal-400">
                        April 2025
                      </div>
                    </div>

                    <div className="mb-6 grid grid-cols-3 gap-4">
                      {[
                        {
                          label: "Revenue",
                          value: "$128,430",
                          change: "+12.5%"
                        },
                        {
                          label: "Expenses",
                          value: "$54,210",
                          change: "-3.6%"
                        },
                        { label: "Profit", value: "$74,220", change: "+24.3%" }
                      ].map((item, i) => (
                        <div
                          key={i}
                          className="rounded-lg bg-slate-800 p-4 shadow-sm"
                        >
                          <p className="text-xs font-medium text-slate-500">
                            {item.label}
                          </p>
                          <p className="text-lg font-bold text-white">
                            {item.value}
                          </p>
                          <p
                            className={`text-xs ${
                              item.change.startsWith("+")
                                ? "text-green-400"
                                : "text-red-400"
                            }`}
                          >
                            {item.change}
                          </p>
                        </div>
                      ))}
                    </div>

                    {/* Chart placeholder */}
                    <div className="relative mb-6 h-36 rounded-lg bg-slate-800">
                      <div className="absolute inset-0 flex items-end px-4 pb-4">
                        <div className="flex w-full justify-between space-x-2">
                          {[35, 55, 42, 65, 48, 72, 85].map((height, i) => (
                            <div key={i} className="w-full">
                              <div
                                className="rounded-t bg-gradient-to-t from-teal-600 to-teal-400"
                                style={{ height: `${height}%` }}
                              ></div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Recent transactions */}
                    <div>
                      <h4 className="mb-3 text-sm font-medium text-slate-400">
                        Recent Transactions
                      </h4>
                      <div className="space-y-2">
                        {[
                          {
                            name: "Office Supplies",
                            amount: "-$230.00",
                            date: "Apr 12"
                          },
                          {
                            name: "Client Payment",
                            amount: "+$4,500.00",
                            date: "Apr 10"
                          },
                          {
                            name: "Software Subscription",
                            amount: "-$49.99",
                            date: "Apr 8"
                          }
                        ].map((tx, i) => (
                          <div
                            key={i}
                            className="flex items-center justify-between rounded-md bg-slate-800/50 px-3 py-2"
                          >
                            <div>
                              <p className="text-sm font-medium text-white">
                                {tx.name}
                              </p>
                              <p className="text-xs text-slate-500">
                                {tx.date}
                              </p>
                            </div>
                            <p
                              className={`text-sm font-medium ${
                                tx.amount.startsWith("+")
                                  ? "text-green-400"
                                  : "text-red-400"
                              }`}
                            >
                              {tx.amount}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Wave divider */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="h-12 w-full fill-gray-50"
        >
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V0C11,6,86.66,28,156.89,37.11c83.43,10.94,157.28-1.65,208.5-19.33Z"></path>
        </svg>
      </div>
    </div>
  )
}

export default Hero
