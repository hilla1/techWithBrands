// src/components/GigPricing.jsx
import React from 'react';

const GigPricing = ({ selectedPlan, handlePlanChange }) => {
  const renderPlanDetails = (plan) => {
    const planDetails = {
      Basic: {
        title: 'Basic Plan',
        price: '$19.99/month',
        features: [
          '5 pages',
          'Responsive design',
          'Basic SEO optimization',
          'Support for 1 month'
        ]
      },
      Standard: {
        title: 'Standard Plan',
        price: '$39.99/month',
        features: [
          '10 pages',
          'Responsive design',
          'Advanced SEO optimization',
          'Support for 3 months'
        ]
      },
      Premium: {
        title: 'Premium Plan',
        price: '$59.99/month',
        features: [
          'Unlimited pages',
          'Responsive design',
          'Full SEO optimization',
          'E-commerce integration',
          'Support for 6 months'
        ]
      }
    };

    const { title, price, features } = planDetails[plan];

    return (
      <div>
        <h3 className="text-2xl font-bold mb-2">{title}</h3>
        <p className="text-gray-700 text-lg mb-4">{price}</p>
        <table className="w-full text-left border-separate border-spacing-2">
          <thead>
            <tr>
              <th className="py-2 px-4 bg-gray-200 text-gray-800 border-b">Feature</th>
            </tr>
          </thead>
          <tbody>
            {features.map((feature, index) => (
              <tr key={index}>
                <td className="py-2 px-4 border-b">{feature}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="md:w-1/3">
      <div className="sticky top-4 bg-white p-6 rounded-md shadow-lg">
        {/* Plan Switcher */}
        <div className="flex justify-between mb-6">
          <button
            onClick={() => handlePlanChange('Basic')}
            className={`px-4 py-2 rounded-md ${
              selectedPlan === 'Basic'
                ? 'bg-[var(--secondary-color)] text-white'
                : 'bg-gray-200 text-gray-800'
            }`}
          >
            Basic
          </button>
          <button
            onClick={() => handlePlanChange('Standard')}
            className={`px-4 py-2 rounded-md ${
              selectedPlan === 'Standard'
                ? 'bg-[var(--secondary-color)] text-white'
                : 'bg-gray-200 text-gray-800'
            }`}
          >
            Standard
          </button>
          <button
            onClick={() => handlePlanChange('Premium')}
            className={`px-4 py-2 rounded-md ${
              selectedPlan === 'Premium'
                ? 'bg-[var(--secondary-color)] text-white'
                : 'bg-gray-200 text-gray-800'
            }`}
          >
            Premium
          </button>
        </div>

        {/* Plan Details */}
        <div>
          {renderPlanDetails(selectedPlan)}

          {/* Call to Action */}
          <button className="mt-6 w-full bg-gradient-to-r from-[#424884] to-[#F89F2D] text-white py-2 rounded-md transition-colors hover:bg-[#2E3191]">
            Select Plan
          </button>
        </div>
      </div>
    </div>
  );
};

export default GigPricing;
