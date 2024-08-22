import React from 'react';
import aboutImage from '../../assets/about.jpg'; // Background image for the header
import techImage from '../../assets/techImage.jpg'; // Replace with your tech image path
import Wrapper from '../reusable/Wrapper';

const AboutUs = () => {
  return (
    <>
      {/* Background Image with Title */}
      <div 
        className="relative w-full h-48 md:h-64 lg:h-80 overflow-hidden bg-cover bg-center"
        style={{ backgroundImage: `url(${aboutImage})` }}
      >
        <h1 className="absolute inset-0 flex items-center justify-center text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white">
          About Us
        </h1>
      </div>

      {/* Content Section */}
      <Wrapper>
        <div className="flex flex-col md:flex-row items-center">
          {/* Tech Image */}
          <div className="w-full md:w-1/2 mb-8 md:mb-0 overflow-hidden">
            <img
              src={techImage}
              alt="Tech"
              className="w-full h-auto rounded-lg shadow-lg transition-transform transform hover:scale-105"
              style={{ objectFit: 'cover' }}
            />
          </div>

          {/* Text Content */}
          <div className="w-full md:w-1/2 md:pl-10">
            <h2 className="text-2xl font-bold text-[var(--primary-color)] mb-4">
              Tech with Brands (TwB)
            </h2>
            <p className="text-[var(--secondary-color)] mb-4 transition-transform transform hover:scale-105 hover:text-[var(--primary-color)]">
              Tech with Brands (TwB) exists to solve problems. We are consultants, first and
              foremost, as we work to leave the world better than we found it.
            </p>
            <p className="text-[var(--primary-color)] mb-4 transition-transform transform hover:scale-105 hover:text-[var(--secondary-color)]">
              But how does this help our customers? By solving their problems, we turn
              those ideas into sales. When problems are converted to products, and those
              products commercialized, our clients get more revenue and potentially create
              more jobs.
            </p>
            <p className="text-[var(--secondary-color)] mb-4 transition-transform transform hover:scale-105 hover:text-[var(--primary-color)]">
              Ideas are simply innovations. We innovate solutions that are commercialized
              for specific markets. Innovation and commercialization are the two parts of
              what we do: Turning ideas into sales.
            </p>
            <p className="text-[var(--primary-color)] mb-4 transition-transform transform hover:scale-105 hover:text-[var(--secondary-color)]">
              Our team delivers effectively on the commercialization because we have
              multidisciplinary teams on each project. We solve problems, build solutions,
              and commercialize them; the combination of these three things pays us while
              setting us apart from conventional consultancies. The wide range of expertise
              within the team allows us to monetize our synergies and this is one of our core
              strengths.
            </p>
          </div>
        </div>
      </Wrapper>

      {/* Mission, Vision, Goals Section */}
      <div className="bg-[#f8f4ec]">
      <Wrapper>
        <div className="flex flex-col md:flex-row justify-between space-y-8 md:space-y-0 md:space-x-6">
          {/* Mission */}
          <div className="group flex-1 p-6 rounded-lg shadow-lg border border-[var(--primary-color)] transform transition-transform duration-300 ease-in-out hover:scale-105 hover:bg-[var(--primary-color)] hover:text-white">
            <h3 className="text-xl font-bold mb-2 text-[var(--primary-color)] group-hover:text-white">
              Mission
            </h3>
            <p>
              To solve problems and build solutions
              that are commercially viable for our
              clients and ourselves through constant
              innovation, imagination, and initiative.
            </p>
            <p className="mt-2">To cut costs and increase sales.</p>
          </div>

          {/* Vision */}
          <div className="group flex-1 p-6 rounded-lg shadow-lg border border-[var(--secondary-color)] transform transition-transform duration-300 ease-in-out hover:scale-105 hover:bg-[var(--secondary-color)] hover:text-white">
            <h3 className="text-xl font-bold mb-2 text-[var(--secondary-color)] group-hover:text-white">
              Vision
            </h3>
            <p>
              To solve problems for the entire
              human race for millennia.
            </p>
            <p className="mt-2">
              Our overarching aim is to innovate solutions for global problems. The big problems
              mean that we cement our modern solutions and those of our clients. Our original tagline was
              "cementing legacy with technology" due to this but it changed to the more customer-
              centric "turning ideas into sales".
            </p>
          </div>

          {/* Goals */}
          <div className="group flex-1 p-6 rounded-lg shadow-lg border border-[var(--primary-color)] transform transition-transform duration-300 ease-in-out hover:scale-105 hover:bg-[var(--primary-color)] hover:text-white">
            <h3 className="text-xl font-bold mb-2 text-[var(--primary-color)] group-hover:text-white">
              Goals
            </h3>
            <p className="font-bold">Goal 1:</p>
            <p>Create then monetize global solutions</p>
            <p className="font-bold mt-4">Goal 2:</p>
            <p>Advice then build technology for clients</p>
            <p className="font-bold mt-4">Goal 3:</p>
            <p>Establish then develop brands</p>
          </div>
        </div>
      </Wrapper>
      </div>

      {/* Why Us Section */}
      <div className="bg-gray-50 p-6 rounded-lg shadow-lg">
      <Wrapper>
          <h2 className="text-3xl font-bold text-[var(--primary-color)] mb-6 text-center">
            Why Us
          </h2>
          <div className="flex flex-col md:flex-row justify-between space-y-8 md:space-y-0 md:space-x-6">
            {/* Tech Consultation */}
            <div className="group flex-1 p-6 rounded-lg shadow-lg border border-[var(--secondary-color)] transform transition-transform duration-300 ease-in-out hover:scale-105 hover:bg-[var(--secondary-color)] hover:text-white">
              <h3 className="text-xl font-bold mb-2 text-[var(--secondary-color)] group-hover:text-white">
                Tech Consultation
              </h3>
              <p>
                We first understand the situation of our customers and then advise on the best technologies they can implement. We chart the best path to results and create the solution, followed by either handing it over or implementing the branding phase.
              </p>
              <ul className="list-disc list-inside mt-4 text-[var(--primary-color)] group-hover:text-white">
                <li>Understand the problem</li>
                <li>Research options</li>
                <li>Create the solution</li>
                <li>Build apps and services</li>
                <li>Train staff</li>
                <li>Iterate for success</li>
              </ul>
            </div>

            {/* Sales Teams for Hire */}
            <div className="group flex-1 p-6 rounded-lg shadow-lg border border-[var(--primary-color)] transform transition-transform duration-300 ease-in-out hover:scale-105 hover:bg-[var(--primary-color)] hover:text-white">
              <h3 className="text-xl font-bold mb-2 text-[var(--primary-color)] group-hover:text-white">
                Sales Teams for Hire
              </h3>
              <p>
                We provide talented sales executives to brands without long-term obligations. This allows clients to boost sales while we place skilled professionals in the field.
              </p>
              <p className="mt-2">
                Our team works in groups with constant support and communication. We do not tolerate misconduct and require clients to cover costs related to accidents.
              </p>
            </div>

            {/* Brand Content Based on Strategic Marketing */}
            <div className="group flex-1 p-6 rounded-lg shadow-lg border border-[var(--secondary-color)] transform transition-transform duration-300 ease-in-out hover:scale-105 hover:bg-[var(--secondary-color)] hover:text-white">
              <h3 className="text-xl font-bold mb-2 text-[var(--secondary-color)] group-hover:text-white">
                Brand Content & Strategic Marketing
              </h3>
              <p>
                We create essential brand documentation, including guides and business plans. Our strategies drive awareness and innovation, helping clients gain publicity and new revenue streams.
              </p>
              <ul className="list-disc list-inside mt-4 text-[var(--primary-color)] group-hover:text-white">
                <li>Document foundational structures</li>
                <li>Establish systems for awareness</li>
                <li>Innovate outreach strategies</li>
              </ul>
            </div>
          </div>
      </Wrapper>
      </div>
    </>
  );
};

export default AboutUs;
