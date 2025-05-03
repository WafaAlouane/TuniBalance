import React from "react"
import { Check } from "lucide-react"

const PricingCard = ({
  name,
  description,
  price,
  frequency,
  features,
  cta,
  popular
}) => {
  return (
    <div
      className={`relative flex flex-col rounded-2xl bg-white shadow-sm ${
        popular
          ? "ring-2 ring-teal-500 shadow-lg scale-105 lg:scale-105 z-10"
          : ""
      }`}
    >
      {popular && (
        <div className="absolute -top-4 right-0 left-0 flex justify-center">
          <span className="inline-flex items-center rounded-full bg-teal-100 px-4 py-1 text-xs font-medium text-teal-800">
            Most Popular
          </span>
        </div>
      )}

      <div className="p-8">
        <h3 className="text-xl font-semibold text-gray-900">{name}</h3>
        <p className="mt-2 text-gray-500">{description}</p>
        <div className="mt-6 flex items-baseline">
          <span className="text-4xl font-extrabold text-gray-900">
            ${price}
          </span>
          <span className="ml-1 text-sm font-medium text-gray-500">
            {frequency}
          </span>
        </div>

        <ul className="mt-8 space-y-4">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <div className="flex-shrink-0">
                <Check className="h-5 w-5 text-teal-500" />
              </div>
              <p className="ml-3 text-gray-600">{feature}</p>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex flex-1 flex-col justify-end p-8 pt-0">
        <button
          className={`w-full rounded-md py-3 px-4 text-center text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 ${
            popular
              ? "bg-teal-600 text-white hover:bg-teal-700"
              : "text-teal-600 border border-teal-600 hover:bg-teal-50"
          }`}
        >
          {cta}
        </button>
      </div>
    </div>
  )
}

export default PricingCard
