import React from 'react';
import Wrapper from '../reusable/Wrapper'; // Ensure this path is correct

// Card component to display each pricing plan
const PricingCard = ({ plan, price, features }) => (
  <div className="bg-white shadow-lg rounded-lg p-6 w-full sm:w-80 mx-4 mb-6 border border-gray-200 transition-transform transform hover:scale-105 hover:bg-[#e0d4c1] hover:text-white">
    <h3 className="text-2xl font-bold mb-4 text-center text-[var(--primary-color)]">{plan}</h3>
    <p className="text-3xl font-semibold mb-4 text-center text-[var(--primary-color)]">${price}</p>
    <ul className="list-disc list-inside text-gray-700 mb-6">
      {features.map((feature, index) => (
        <li key={index} className="mb-2">{feature}</li>
      ))}
    </ul>
    <button className="bg-[var(--secondary-color)] text-white px-4 py-2 rounded-lg hover:bg-[var(--primary-color)] w-full">
      Start now
    </button>
  </div>
);

const Pricing = () => {
  const pricingPlans = [
    {
      plan: "Starter",
      price: "50",
      features: [
        "Rapid Results",
        "Standard Report",
        "Market Analysis"
      ]
    },
    {
      plan: "Pro",
      price: "180",
      features: [
        "Everything starter plus",
        "Extended Report",
        "Design Solutions",
        "Strategy Proposal"
      ]
    },
    {
      plan: "Corporate",
      price: "390",
      features: [
        "Pro on steroids",
        "Detailed Report",
        "Trainable Models",
        "On-site Visit"
      ]
    }
  ];

  return (
    <div className="bg-[#1d2356]">
      <Wrapper>
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 text-white">Our Pricing Plan</h1>
        </div>
        <div className="flex flex-wrap justify-center">
          {pricingPlans.map((plan, index) => (
            <PricingCard
              key={index}
              plan={plan.plan}
              price={plan.price}
              features={plan.features}
            />
          ))}
        </div>
      </Wrapper>
    </div>
  );
};

export default Pricing;
