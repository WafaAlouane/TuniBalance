import React from "react"
import { Star } from "lucide-react"

const TestimonialCard = ({ content, author, role, avatar, rating }) => {
  return (
    <div className="group relative rounded-2xl bg-white p-6 shadow-md transition-all duration-300 hover:shadow-lg">
      {/* Quotation mark decoration */}
      <div className="absolute top-6 right-6 text-6xl font-serif text-gray-200 opacity-60">
        "
      </div>

      {/* Star rating */}
      <div className="mb-4 flex">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-5 w-5 ${
              i < rating
                ? "fill-yellow-400 text-yellow-400"
                : "fill-gray-200 text-gray-200"
            }`}
          />
        ))}
      </div>

      {/* Testimonial content */}
      <p className="mb-6 text-gray-700 relative z-10">{content}</p>

      {/* Author info */}
      <div className="flex items-center">
        <img
          src={avatar}
          alt={author}
          className="h-12 w-12 rounded-full object-cover mr-4"
        />
        <div>
          <p className="font-medium text-gray-900">{author}</p>
          <p className="text-sm text-gray-600">{role}</p>
        </div>
      </div>

      {/* Background decoration */}
      <div className="absolute bottom-0 right-0 h-32 w-32 transform rounded-br-2xl bg-gradient-to-br from-teal-50 to-teal-100 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
    </div>
  )
}

export default TestimonialCard
