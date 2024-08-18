import React from 'react';
import Wrapper from './Wrapper';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { FaRedditAlien, FaFacebookF, FaYoutube, FaLinkedinIn } from 'react-icons/fa';

// Define the Zod schema for validation
const schema = z.object({
  name: z.string().min(1, "Name is required").max(50, "Name can't be longer than 50 characters"),
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  message: z.string().min(1, "Message is required").max(500, "Message can't be longer than 500 characters"),
});

const Contact = () => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data) => {
    // Handle form submission logic
    console.log('Form submitted:', data);
    // Reset form
    reset();
  };

  return (
    <div className="bg-gray-100">
      <Wrapper>
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[var(--primary-color)] mb-4">Contact Us</h1>
          <p className="text-lg text-gray-700">We'd love to hear from you! Fill out the form below or reach out to us through our contact details.</p>
        </div>

        <div className="flex flex-col lg:flex-row lg:space-x-12">
          <div className="lg:w-1/2 mb-8 lg:mb-0">
            <form onSubmit={handleSubmit(onSubmit)} className="bg-white shadow-lg rounded-lg p-6 border border-gray-200">
              <h2 className="text-2xl font-semibold text-[var(--primary-color)] mb-4">Get in Touch</h2>
              <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                <input
                  type="text"
                  id="name"
                  {...register('name')}
                  className={`w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[var(--primary-color)] ${errors.name ? 'border-red-500' : ''}`}
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
              </div>
              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  id="email"
                  {...register('email')}
                  className={`w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[var(--primary-color)] ${errors.email ? 'border-red-500' : ''}`}
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
              </div>
              <div className="mb-4">
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                <textarea
                  id="message"
                  {...register('message')}
                  rows="4"
                  className={`w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[var(--primary-color)] ${errors.message ? 'border-red-500' : ''}`}
                ></textarea>
                {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message.message}</p>}
              </div>
              <button
                type="submit"
                className="bg-[var(--secondary-color)] text-white px-6 py-3 rounded-lg hover:bg-[var(--primary-color)]"
              >
                Send Message
              </button>
            </form>
          </div>

          <div className="lg:w-1/2">
            <div className="bg-white shadow-lg rounded-lg p-6 border border-gray-200">
              <h2 className="text-2xl font-semibold text-[var(--primary-color)] mb-4">Contact Details</h2>
              <p className="text-lg text-gray-700 mb-4">
                <strong>Address:</strong> Nairobi, Kenya
              </p>
              <p className="text-lg text-gray-700 mb-4">
                <strong>Phone:</strong> +254791472688
              </p>
              <p className="text-lg text-gray-700 mb-4">
                <strong>Email:</strong> admin@techwithbrands.com
              </p>
              <p className="text-lg text-gray-700 mb-8">
                <strong>Office Hours:</strong> Mon-Fri, 9:00 AM - 6:00 PM
              </p>

              {/* Social Media Links */}
              <h3 className="text-xl font-semibold text-[var(--primary-color)] mb-4">Connect with Us</h3>
              <div className="flex space-x-4">
                <a href="https://www.reddit.com/user/techwithbrands/" target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-[var(--primary-color)]">
                  <FaRedditAlien size={24} />
                </a>
                <a href="https://web.facebook.com/TwBonFB" target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-[var(--primary-color)]">
                  <FaFacebookF size={24} />
                </a>
                <a href="https://www.youtube.com/c/techwithbrands" target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-[var(--primary-color)]">
                  <FaYoutube size={24} />
                </a>
                <a href="https://www.linkedin.com/company/techwithbrands/mycompany/" target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-[var(--primary-color)]">
                  <FaLinkedinIn size={24} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </Wrapper>
    </div>
  );
};

export default Contact;