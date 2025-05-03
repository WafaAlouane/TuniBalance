import React from "react"
import TestimonialCard from "./TestimonialCard"

const Testimonials = () => {
  const testimonials = [
    {
      content:
        "FinanceFlow has completely transformed how we manage our finances. The reporting tools provide valuable insights that have helped us optimize our spending and increase profitability.",
      author: "Sarah Johnson",
      role: "CEO, TechStart Inc.",
      avatar: "https://randomuser.me/api/portraits/women/32.jpg",
      rating: 5
    },
    {
      content:
        "As a freelancer, keeping track of expenses and invoices was always a headache. This platform has streamlined everything and the automated tax calculations save me hours every month.",
      author: "Michael Chen",
      role: "Independent Consultant",
      avatar: "https://randomuser.me/api/portraits/men/44.jpg",
      rating: 5
    },
    {
      content:
        "The client management feature is exceptional. We can now see a complete financial history for each client, which has improved our customer service and billing accuracy.",
      author: "Emma Rodriguez",
      role: "Operations Director, Growth Partners",
      avatar: "https://randomuser.me/api/portraits/women/68.jpg",
      rating: 4
    },
    {
      content:
        "Moving our accounting to this platform was the best decision we made last year. The time savings alone paid for the subscription, and the financial insights have been invaluable.",
      author: "David Wilson",
      role: "CFO, Innovate Solutions",
      avatar: "https://randomuser.me/api/portraits/men/71.jpg",
      rating: 5
    }
  ]

  return (
    <section id="testimonials" className="py-20 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center mb-16">
          <h2 className="text-base font-semibold uppercase tracking-wide text-teal-600">
            Testimonials
          </h2>
          <p className="mt-2 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Trusted by businesses worldwide
          </p>
          <p className="mt-4 text-xl text-gray-500">
            Don't just take our word for it. Here's what our customers have to
            say about our platform.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-2">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard
              key={index}
              content={testimonial.content}
              author={testimonial.author}
              role={testimonial.role}
              avatar={testimonial.avatar}
              rating={testimonial.rating}
            />
          ))}
        </div>

        <div className="mt-16 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">
            Trusted by leading companies
          </h3>
          <div className="flex flex-wrap justify-center gap-x-12 gap-y-8">
            {/* Company logos - using text as placeholders */}
            {[
              "Acme Inc.",
              "TechCorp",
              "GlobalFin",
              "InnovateX",
              "FutureCo"
            ].map((company, index) => (
              <div key={index} className="flex items-center justify-center">
                <span className="text-2xl font-bold text-gray-400">
                  {company}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Testimonials
