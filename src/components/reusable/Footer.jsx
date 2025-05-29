import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import Wrapper from './Wrapper';
import twbLogo from '../../assets/twbLogo.png';
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram } from 'react-icons/fa';
import useApiRequest from '../../hooks/useApiRequest';

// Define Zod schema for validation
const subscribeSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
});

const Footer = () => {
  const { makeRequest, loading } = useApiRequest(); // Use the custom hook
  const [buttonState, setButtonState] = useState({
    text: 'Subscribe',
    bgColor: 'bg-[var(--secondary-color)]',
  }); // State to manage button text and color

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(subscribeSchema),
  });

  const navigate = useNavigate();

  // Function to reset button state to default
  const resetButtonState = () => {
    setButtonState({
      text: 'Subscribe',
      bgColor: 'bg-[var(--secondary-color)]',
    });
  };

  const onSubmit = async (data) => {
    try {
      const response = await makeRequest('/subscribe', 'POST', data);

      // On success
      setButtonState({
        text: response.message || 'Subscribed!',
        bgColor: 'bg-green-500',
      });

      // Reset button state after 2 seconds
      setTimeout(() => {
        resetButtonState();
      }, 2000);

    } catch (err) {
      // On failure (e.g., 400 error with response.message)
      if (err.response?.status === 400) {
        setButtonState({
          text: err.response.data.message || 'Subscription failed',
          bgColor: 'bg-red-500',
        });
      } else {
        setButtonState({
          text: 'An error occurred',
          bgColor: 'bg-red-500',
        });
      }

      // Reset button state after 2 seconds on failure
      setTimeout(() => {
        resetButtonState();
      }, 2000);
    }
  };

  // Navigate to the top of the page
  const goToTop = () => {
    navigate('/');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-gray-900 text-white">
      <Wrapper>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 py-8">
          <div className="flex flex-col">
            <button onClick={goToTop}>
              <img src={twbLogo} alt="TechwithBrands Logo" className="w-60 mb-4" />
            </button>
            <p className="text-lg">
            Transforming brands through innovative technology solutions.
            </p>
          </div>

          <div>
            <h4 className="text-xl font-semibold mb-4">Services</h4>
            <ul>
              <li><a href="#consultation" className="text-white hover:underline">Consultation Services</a></li>
              <li><a href="#tech-solutions" className="text-white hover:underline">Tech Solutions</a></li>
              <li><a href="#brand-solutions" className="text-white hover:underline">Brand Solutions</a></li>
              <li><a href="/contact" className="text-white hover:underline">Contact Us</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xl font-semibold mb-4">Contact Us</h4>
            <ul>
              <li className="mb-2">Nairobi, Kenya</li>
              <li className="mb-2">Phone: +254791472688</li>
              <li className="mb-2">Email: admin@techwithbrands.com</li>
              <li className="mb-2">Office Hours: Mon-Fri, 9:00 AM - 6:00 PM</li>
            </ul>
          </div>

          <div className="flex flex-col">
            <h4 className="text-xl font-semibold mb-4">Subscribe</h4>
            <form
              onSubmit={handleSubmit(onSubmit)}
              onClick={resetButtonState} // Reset button when clicking on the form
              className="flex flex-col"
            >
              <input
                type="email"
                placeholder="Enter your email"
                {...register('email')}
                className={`p-3 mb-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:border-white text-black`}
              />
              {errors.email && <span className="text-red-500 text-sm mb-2">{errors.email.message}</span>}
              <button
                type="submit"
                className={`${buttonState.bgColor} text-white px-4 py-2 rounded-lg hover:bg-[var(--primary-color)]`}
                disabled={loading}
              >
                {loading ? 'Subscribing...' : buttonState.text}
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

      <div className="bg-black text-center py-2">
        <p className="text-xs md:text-xl">&copy; {new Date().getFullYear()} TechwithBrands. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
