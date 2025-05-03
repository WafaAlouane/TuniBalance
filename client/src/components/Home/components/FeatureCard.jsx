import React from "react"

const FeatureCard = ({ icon, title, description }) => {
  return (
    <div className="group relative overflow-hidden rounded-lg bg-white p-6 shadow-md transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-teal-50 text-teal-600">
        {icon}
      </div>
      <h3 className="mb-2 text-xl font-semibold text-gray-900">{title}</h3>
      <p className="text-gray-600">{description}</p>

      {/* Decorative gradient */}
      <div className="absolute bottom-0 right-0 h-24 w-24 translate-x-8 translate-y-8 transform rounded-full bg-teal-100 opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-70"></div>
    </div>
  )
}

export default FeatureCard
