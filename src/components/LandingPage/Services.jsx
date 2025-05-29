import React from 'react';
import Wrapper from '../reusable/Wrapper';
import {
  FaCogs,
  FaBullseye,
  FaUserFriends,
  FaCheck,
} from 'react-icons/fa';

// Services data
const services = [
  {
    id: 1,
    icon: <FaCogs />,
    title: 'Digital Transformation',
    description:
      'Modernize your business processes and customer touchpoints with cutting-edge technology.',
    points: ['Process Automation', 'Cloud Migration', 'System Integration'],
    bgColor: 'bg-gradient-to-tr from-blue-100 to-blue-50',
  },
  {
    id: 2,
    icon: <FaBullseye />,
    title: 'Brand Technology Strategy',
    description:
      'Align your technology investments with your brand goals and market positioning.',
    points: ['Tech Roadmapping', 'Digital Strategy', 'ROI Analysis'],
    bgColor: 'bg-gradient-to-tr from-orange-100 to-orange-50',
  },
  {
    id: 3,
    icon: <FaUserFriends />,
    title: 'Customer Experience Tech',
    description:
      'Enhance customer interactions with personalized, technology-driven experiences.',
    points: ['CRM Implementation', 'Personalization Engines', 'Analytics & Insights'],
    bgColor: 'bg-gradient-to-tr from-green-100 to-green-50',
  },
];

const Services = () => {
  return (
    <Wrapper>
      {/* Section Heading */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-3 text-[var(--primary-color)]">
          Our Services
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Comprehensive tech solutions tailored to your brand's unique needs
        </p>
      </div>

      {/* Services Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {services.map((service, index) => (
          <div
            key={service.id}
            className={`${service.bgColor} p-6 rounded-2xl border border-gray-200 shadow-md transition duration-500 hover:scale-[1.03] hover:shadow-xl hover:border-[var(--primary-color)] hover:rotate-[-1deg]`}
            style={{ animation: `fadeInUp 0.4s ease-in-out ${index * 0.2}s both` }}
          >
            <div className="text-4xl mb-4 text-[var(--primary-color)] flex justify-center">
              {service.icon}
            </div>
            <h3 className="text-2xl font-semibold text-center mb-2 text-gray-800">
              {service.title}
            </h3>
            <p className="text-gray-600 text-center mb-4">{service.description}</p>
            <ul className="space-y-3">
              {service.points.map((point, i) => (
                <li key={i} className="flex items-center text-gray-700">
                  <div className="w-6 h-6 flex items-center justify-center rounded-full bg-[var(--primary-color)] text-white mr-3 shadow-md">
                    <FaCheck className="text-sm" />
                  </div>
                  <span className="text-base">{point}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Animations */}
      <style jsx>{`
        @keyframes fadeInUp {
          0% {
            transform: translateY(30px);
            opacity: 0;
          }
          100% {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>
    </Wrapper>
  );
};

export default Services;
