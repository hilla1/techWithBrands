import React from 'react';
import Wrapper from '../reusable/Wrapper';
import { FaCheckCircle, FaStar, FaRegStar, FaSmile, FaProjectDiagram, FaRedo, FaHeadset } from 'react-icons/fa';
import CountUp from 'react-countup';
import { useInView } from 'react-intersection-observer';

const reasons = [
  {
    title: 'Brand-First Approach',
    description: 'Technology solutions that strengthen your brand identity',
  },
  {
    title: 'Proven Results',
    description: '500+ successful projects with measurable ROI',
  },
  {
    title: 'End-to-End Support',
    description: 'From strategy to implementation and ongoing support',
  },
];

const stats = [
  {
    label: 'Client Satisfaction',
    value: 4.9,
    type: 'stars',
    icon: <FaSmile />,
  },
  {
    label: 'Projects Completed',
    value: 500,
    suffix: '+',
    type: 'number',
    icon: <FaProjectDiagram />,
  },
  {
    label: 'Client Retention',
    value: 98,
    suffix: '%',
    type: 'number',
    icon: <FaRedo />,
  },
  {
    label: 'Support Available',
    value: 24,
    suffix: '/7',
    type: 'number',
    icon: <FaHeadset />,
  },
];

const WhyChooseUs = () => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 });

  const renderStars = (value) => {
    const fullStars = Math.floor(value);
    const hasHalf = value % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalf ? 1 : 0);
    return (
      <div className="flex justify-center items-center gap-1">
        {[...Array(fullStars)].map((_, i) => (
          <FaStar key={`full-${i}`} className="text-yellow-400 text-xl" />
        ))}
        {hasHalf && <FaStar className="text-yellow-300 text-xl opacity-50" />}
        {[...Array(emptyStars)].map((_, i) => (
          <FaRegStar key={`empty-${i}`} className="text-gray-300 text-xl" />
        ))}
      </div>
    );
  };

  return (
    <div className='bg-gray-100'>
    <Wrapper>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        {/* Left Side */}
        <div>
          <h2 className="text-4xl font-bold mb-4 text-[var(--primary-color)]">
            Why Choose Tech with Brands?
          </h2>
          <p className="text-gray-700 mb-6">
            We understand that every brand is unique. Our approach combines deep technical expertise with brand strategy to deliver solutions that not only work but also enhance your brand identity.
          </p>

          <div className="space-y-6">
            {reasons.map((reason, index) => (
              <div key={index} className="flex items-start gap-3">
                <FaCheckCircle className="text-[var(--primary-color)] text-xl mt-1" />
                <div>
                  <h4 className="text-lg font-semibold text-gray-800">
                    {reason.title}
                  </h4>
                  <p className="text-gray-600">{reason.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side (Stats) */}
        <div ref={ref} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white/70 backdrop-blur-lg border border-white/40 shadow-xl rounded-2xl p-6 text-center transition-all duration-300 hover:scale-105 hover:shadow-2xl"
            >
              {/* Icon circle */}
              <div className="flex justify-center items-center mb-4 w-14 h-14 rounded-full bg-gradient-to-br from-[var(--primary-color)] to-[var(--secondary-color)] text-white text-2xl shadow-md mx-auto">
                {stat.icon}
              </div>

              {/* Value */}
              <div className="text-3xl font-bold text-[var(--primary-color)] mb-1">
                {stat.type === 'stars'
                  ? inView && renderStars(stat.value)
                  : inView && (
                      <CountUp
                        end={stat.value}
                        duration={2}
                        suffix={stat.suffix || ''}
                      />
                    )}
              </div>

              {/* Label */}
              <p className="text-gray-800 font-semibold mt-2 text-lg">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </Wrapper>
   </div>
  );
};

export default WhyChooseUs;
