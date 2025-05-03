import React from "react"
import {
  BarChart2,
  PieChart,
  TrendingUp,
  Clock,
  Shield,
  CreditCard,
  Users,
  LineChart
} from "lucide-react"
import FeatureCard from "./FeatureCard"

const Features = () => {
  const features = [
    {
      icon: <BarChart2 className="h-8 w-8 text-teal-500" />,
      title: "Financial Reporting",
      description:
        "Generate comprehensive financial reports with just a few clicks. Visualize your business performance instantly."
    },
    {
      icon: <TrendingUp className="h-8 w-8 text-teal-500" />,
      title: "Revenue Tracking",
      description:
        "Monitor all your revenue streams in real-time. Identify growth opportunities with intuitive analytics."
    },
    {
      icon: <PieChart className="h-8 w-8 text-teal-500" />,
      title: "Expense Management",
      description:
        "Categorize and track expenses automatically. Optimize spending with smart budget recommendations."
    },
    {
      icon: <Clock className="h-8 w-8 text-teal-500" />,
      title: "Time Tracking",
      description:
        "Track billable hours with precision. Automatically generate invoices based on time entries."
    },
    {
      icon: <Shield className="h-8 w-8 text-teal-500" />,
      title: "Tax Compliance",
      description:
        "Stay compliant with automated tax calculations. Prepare for tax season without the stress."
    },
    {
      icon: <CreditCard className="h-8 w-8 text-teal-500" />,
      title: "Invoice & Payments",
      description:
        "Create professional invoices and accept payments online. Get paid faster with automated reminders."
    },
    {
      icon: <Users className="h-8 w-8 text-teal-500" />,
      title: "Client Management",
      description:
        "Manage client relationships effortlessly. Store all important client information in one place."
    },
    {
      icon: <LineChart className="h-8 w-8 text-teal-500" />,
      title: "Forecasting",
      description:
        "Predict future financial performance with AI-powered forecasting tools. Plan with confidence."
    }
  ]

  return (
    <section id="features" className="py-20 bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center mb-16">
          <h2 className="text-base font-semibold uppercase tracking-wide text-teal-600">
            Features
          </h2>
          <p className="mt-2 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Everything you need to manage your finances
          </p>
          <p className="mt-4 text-xl text-gray-500">
            Our comprehensive suite of tools helps you streamline accounting
            processes, gain valuable insights, and make informed financial
            decisions.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default Features
