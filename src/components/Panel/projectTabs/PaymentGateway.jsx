"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { FiCheck, FiCreditCard, FiStar } from "react-icons/fi"

const plans = [
  {
    name: "Basic",
    price: "$29",
    period: "/month",
    description: "Perfect for small projects and startups",
    features: [
      "Up to 3 projects",
      "Basic consultation (5 hours)",
      "Email support",
      "Standard templates",
      "Basic analytics",
    ],
    popular: false,
  },
  {
    name: "Standard",
    price: "$99",
    period: "/month",
    description: "Ideal for growing businesses",
    features: [
      "Up to 10 projects",
      "Extended consultation (20 hours)",
      "Priority support",
      "Premium templates",
      "Advanced analytics",
      "Team collaboration",
      "API access",
    ],
    popular: true,
  },
  {
    name: "Premium",
    price: "$299",
    period: "/month",
    description: "For enterprise-level requirements",
    features: [
      "Unlimited projects",
      "Dedicated consultation (50 hours)",
      "24/7 phone support",
      "Custom development",
      "Advanced analytics",
      "Team collaboration",
      "Full API access",
      "Custom integrations",
      "White-label solutions",
    ],
    popular: false,
  },
]

const paymentSchema = z.object({
  cardholderName: z.string().min(2, "Name must be at least 2 characters"),
  cardNumber: z.string().regex(/^\d{16}$/, "Card number must be 16 digits"),
  expiryMonth: z.string().min(1, "Please select expiry month"),
  expiryYear: z.string().min(1, "Please select expiry year"),
  cvc: z.string().regex(/^\d{3,4}$/, "CVC must be 3 or 4 digits"),
})

export default function PaymentGateway() {
  const [selectedPlan, setSelectedPlan] = useState("Standard")

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(paymentSchema),
  })

  const onSubmit = (data) => {
    console.log("Payment data:", data)
    alert("Payment processed successfully!")
  }

  const getSelectedPlan = () => plans.find((p) => p.name === selectedPlan)

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Choose Your Plan</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Select the perfect plan for your development needs. Upgrade or downgrade at any time.
        </p>
      </div>

      {/* Pricing Tiers */}
      <div className="grid md:grid-cols-3 gap-8">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`card relative p-6 transition-all duration-200 hover:shadow-lg ${
              selectedPlan === plan.name ? "ring-2 ring-primary-500 shadow-lg" : "hover:shadow-md"
            } ${plan.popular ? "scale-105" : ""}`}
          >
            {plan.popular && (
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-primary-600 text-white px-4 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                  <FiStar className="h-4 w-4" />
                  Most Popular
                </span>
              </div>
            )}

            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
              <p className="text-gray-600 mb-4">{plan.description}</p>
              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                <span className="text-gray-600">{plan.period}</span>
              </div>
            </div>

            <ul className="space-y-3 mb-8">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-center gap-3">
                  <FiCheck className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>

            <button
              className={`btn w-full ${selectedPlan === plan.name ? "btn-primary" : "btn-outline"}`}
              onClick={() => setSelectedPlan(plan.name)}
            >
              {selectedPlan === plan.name ? "Selected" : "Select Plan"}
            </button>
          </div>
        ))}
      </div>

      {/* Payment Form */}
      <div className="card max-w-2xl mx-auto p-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <FiCreditCard className="h-8 w-8 text-primary-600" />
            <h2 className="text-3xl font-bold">Secure Payment</h2>
          </div>
          <p className="text-gray-600">Complete your subscription to {selectedPlan} plan</p>
        </div>

        {/* Selected Plan Summary */}
        <div className="bg-primary-50 p-6 rounded-lg border border-primary-200 mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-semibold text-gray-900 text-lg">{selectedPlan} Plan</h3>
              <p className="text-gray-600">{getSelectedPlan()?.description}</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-gray-900">
                {getSelectedPlan()?.price}
                <span className="text-lg font-normal text-gray-600">/month</span>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label htmlFor="cardholderName" className="block text-sm font-medium text-gray-700 mb-2">
              Cardholder Name
            </label>
            <input {...register("cardholderName")} type="text" className="input" placeholder="John Doe" />
            {errors.cardholderName && <p className="mt-1 text-sm text-red-600">{errors.cardholderName.message}</p>}
          </div>

          <div>
            <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-2">
              Card Number
            </label>
            <input
              {...register("cardNumber")}
              type="text"
              className="input"
              placeholder="1234567890123456"
              maxLength={16}
            />
            {errors.cardNumber && <p className="mt-1 text-sm text-red-600">{errors.cardNumber.message}</p>}
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label htmlFor="expiryMonth" className="block text-sm font-medium text-gray-700 mb-2">
                Month
              </label>
              <select {...register("expiryMonth")} className="input">
                <option value="">MM</option>
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i + 1} value={String(i + 1).padStart(2, "0")}>
                    {String(i + 1).padStart(2, "0")}
                  </option>
                ))}
              </select>
              {errors.expiryMonth && <p className="mt-1 text-sm text-red-600">{errors.expiryMonth.message}</p>}
            </div>

            <div>
              <label htmlFor="expiryYear" className="block text-sm font-medium text-gray-700 mb-2">
                Year
              </label>
              <select {...register("expiryYear")} className="input">
                <option value="">YYYY</option>
                {Array.from({ length: 10 }, (_, i) => (
                  <option key={2024 + i} value={2024 + i}>
                    {2024 + i}
                  </option>
                ))}
              </select>
              {errors.expiryYear && <p className="mt-1 text-sm text-red-600">{errors.expiryYear.message}</p>}
            </div>

            <div>
              <label htmlFor="cvc" className="block text-sm font-medium text-gray-700 mb-2">
                CVC
              </label>
              <input {...register("cvc")} type="text" className="input" placeholder="123" maxLength={4} />
              {errors.cvc && <p className="mt-1 text-sm text-red-600">{errors.cvc.message}</p>}
            </div>
          </div>

          <button type="submit" className="btn btn-primary w-full text-lg py-4">
            Complete Payment - {getSelectedPlan()?.price}/month
          </button>
        </form>

        <div className="text-center mt-6 text-gray-500">
          <p className="text-sm flex items-center justify-center gap-2">
            🔒 Your payment information is secure and encrypted
          </p>
        </div>
      </div>
    </div>
  )
}
