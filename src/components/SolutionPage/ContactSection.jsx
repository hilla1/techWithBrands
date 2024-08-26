import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios'; // Import Axios
import { FaRedditAlien, FaFacebookF, FaYoutube, FaLinkedinIn } from 'react-icons/fa';
import { ImSpinner2 } from 'react-icons/im'; // Import spinner icon

// Define the schema for form validation with Zod
const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  phone: z.string().min(1, 'Phone is required'),
  email: z.string().email('Invalid email address'),
  message: z.string().min(1, 'Message is required'),
});

const ContactSection = () => {
  const [showContactForm, setShowContactForm] = useState(false);
  const [messageSent, setMessageSent] = useState(false);
  const [loading, setLoading] = useState(false); // Added loading state

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data) => {
    setLoading(true); // Show spinner on submit
    try {
      const response = await axios.post('/.netlify/functions/sendEmail', data, {
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.status === 200) {
        setMessageSent(true);
        reset(); // Clear form fields after submission
        setTimeout(() => setMessageSent(false), 5000); // Clear message sent status after 5 seconds
      } else {
        setMessageSent(false); // Handle failed submission silently
      }
    } catch (error) {
      setMessageSent(false); // Handle error silently
      console.error('Error sending message:', error);
    } finally {
      setLoading(false); // Hide spinner after processing
    }
  };

  return (
    <div className="mt-10 p-6 bg-white border rounded-lg shadow-lg">
      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setShowContactForm(false)}
          className={`py-2 px-4 rounded-lg transition-colors duration-300 ease-in-out ${!showContactForm ? 'bg-[#F89F2D] text-black' : 'bg-[#2E3191] text-white'} hover:bg-[#F89F2D]`}
        >
          Contact Information
        </button>
        <button
          onClick={() => setShowContactForm(true)}
          className={`py-2 px-4 rounded-lg transition-colors duration-300 ease-in-out ${showContactForm ? 'bg-[#F89F2D] text-black' : 'bg-[#2E3191] text-white'} hover:bg-[#F89F2D]`}
        >
          Contact Form
        </button>
      </div>
      {showContactForm ? (
        <div className="mt-4">
          {messageSent && !loading && <p className="text-green-500 mb-4">Message has been sent!</p>}
          <h2 className="text-xl font-bold mb-4">Contact Us</h2>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                {...register('name')}
                className="w-full p-2 border rounded-lg"
              />
              {errors.name && <p className="text-red-500">{errors.name.message}</p>}
            </div>
            <div className="mb-4 flex space-x-4">
              <div className="w-1/2">
                <label className="block text-gray-700 mb-2" htmlFor="phone">Phone</label>
                <input
                  type="text"
                  id="phone"
                  {...register('phone')}
                  className="w-full p-2 border rounded-lg"
                />
                {errors.phone && <p className="text-red-500">{errors.phone.message}</p>}
              </div>
              <div className="w-1/2">
                <label className="block text-gray-700 mb-2" htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  {...register('email')}
                  className="w-full p-2 border rounded-lg"
                />
                {errors.email && <p className="text-red-500">{errors.email.message}</p>}
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="message">Message</label>
              <textarea
                id="message"
                {...register('message')}
                className="w-full p-2 border rounded-lg"
                rows="4"
              ></textarea>
              {errors.message && <p className="text-red-500">{errors.message.message}</p>}
            </div>
            <button
              type="submit"
              className="px-6 py-3 rounded-lg shadow-lg transition-transform transform relative flex items-center justify-center text-white"
              style={{ backgroundColor: 'var(--primary-color)' }}
            >
              {loading && <ImSpinner2 className="animate-spin absolute" size={20} />}
              <span className={`transition-opacity ${loading ? 'opacity-0' : 'opacity-100'}`}>Send Message</span>
            </button>
          </form>
        </div>
      ) : (
        <div className="mt-4">
          <h2 className="text-xl font-bold mb-4">Contact Details</h2>
          <p className="mb-2"><strong>Address:</strong> Nairobi, Kenya</p>
          <p className="mb-2"><strong>Phone:</strong> +254791472688</p>
          <p className="mb-2"><strong>Email:</strong> admin@techwithbrands.com</p>
          <p className="mb-2"><strong>Office Hours:</strong> Mon-Fri, 9:00 AM - 6:00 PM</p>
          <h3 className="text-xl font-semibold text-[#2E3191] mb-4">Connect with Us</h3>
          <div className="flex space-x-4">
            <a href="https://www.reddit.com/user/techwithbrands/" target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-[#2E3191]">
              <FaRedditAlien size={24} />
            </a>
            <a href="https://web.facebook.com/TwBonFB" target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-[#2E3191]">
              <FaFacebookF size={24} />
            </a>
            <a href="https://www.youtube.com/@TechwithBrands" target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-[#2E3191]">
              <FaYoutube size={24} />
            </a>
            <a href="https://www.linkedin.com/company/techwithbrands/mycompany/" target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-[#2E3191]">
              <FaLinkedinIn size={24} />
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactSection;
