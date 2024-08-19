import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom'; 
import Wrapper from './Wrapper'; 
import twbLogo from '../../assets/twbLogo.png'; 
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram } from 'react-icons/fa';

// Define Zod schema for validation
const subscribeSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
});

const Footer = () => {
  // Use React Hook Form with Zod resolver
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(subscribeSchema),
  });

  // Use navigate for programmatic navigation
  const navigate = useNavigate();

  // Handle form submission
  const onSubmit = (data) => {
    // Handle the valid form submission
    console.log('Form submitted with:', data);
    // Here you can add your API call or any other logic to handle the subscription
  };

  // Function to navigate to the top of the landing page
  const goToTop = () => {
    navigate('/'); // Navigate to the landing page
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to the top smoothly
  };

  return (
    <footer className="bg-[#1d2356] text-white">
      <Wrapper>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 py-8">
          {/* Column 1: Logo and Description */}
          <div className="flex flex-col">
            {/* Use a button to trigger the scroll function */}
            <button onClick={goToTop}>
              <img src={twbLogo} alt="TechwithBrands Logo" className="w-60 mb-4" />
            </button>
            <p className="text-lg">
              TechwithBrands is dedicated to transforming ideas into innovative solutions. We specialize in consultation, tech solutions, and branding to help businesses thrive in the digital age. Our expertise in web and mobile apps, along with effective brand strategies, ensures your success in a competitive market.
            </p>
          </div>
          
          {/* Column 2: Services */}
          <div>
            <h4 className="text-xl font-semibold mb-4">Services</h4>
            <ul>
              <li><a href="#consultation" className="text-white hover:underline">Consultation Services</a></li>
              <li><a href="#tech-solutions" className="text-white hover:underline">Tech Solutions</a></li>
              <li><a href="#brand-solutions" className="text-white hover:underline">Brand Solutions</a></li>
              <li><a href="/contact" className="text-white hover:underline">Contact Us</a></li>
            </ul>
          </div>

          {/* Column 3: Contact Information */}
          <div>
            <h4 className="text-xl font-semibold mb-4">Contact Us</h4>
            <ul>
              <li className="mb-2">Nairobi, Kenya</li>
              <li className="mb-2">Phone: +254791472688</li>
              <li className="mb-2">Email: admin@techwithbrands.com</li>
              <li className="mb-2">Office Hours: Mon-Fri, 9:00 AM - 6:00 PM</li>
            </ul>
          </div>

          {/* Column 4: Subscribe and Social Media */}
          <div className="flex flex-col">
            <h4 className="text-xl font-semibold mb-4">Subscribe</h4>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
              <input
                type="email"
                placeholder="Enter your email"
                {...register('email')}
                className={`p-3 mb-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:border-white text-black`}
              />
              {errors.email && <span className="text-red-500 text-sm mb-2">{errors.email.message}</span>}
              <button
                type="submit"
                className="bg-[var(--secondary-color)] text-white px-4 py-2 rounded-lg hover:bg-[var(--primary-color)]"
              >
                Subscribe
              </button>
            </form>
            <div className="flex space-x-4 mt-6">
              <a href="https://www.facebook.com/TwBonFB" target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-300">
                <FaFacebookF size={20} />
              </a>
              <a href="https://twitter.com/techwithbrands" target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-300">
                <FaTwitter size={20} />
              </a>
              <a href="https://www.linkedin.com/company/techwithbrands/mycompany/" target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-300">
                <FaLinkedinIn size={20} />
              </a>
              <a href="https://www.instagram.com/techwithbrands/" target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-300">
                <FaInstagram size={20} />
              </a>
            </div>
          </div>
        </div>
      </Wrapper>
      
      {/* Copyright Section */}
      <div className="bg-black text-center py-2">
        <p className="text-xs md:text-xl">&copy; {new Date().getFullYear()} TechwithBrands. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
