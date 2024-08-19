import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { FaRedditAlien, FaFacebookF, FaYoutube, FaLinkedinIn } from 'react-icons/fa';

// Define the schema for form validation with Zod
const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  message: z.string().min(1, 'Message is required'),
});

const ContactSection = () => {
  const [showContactForm, setShowContactForm] = useState(false);
  const [messageSent, setMessageSent] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      const response = await fetch('/.netlify/functions/sendEmail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (response.ok) {
        setMessageSent(true);
        reset(); // Clear form fields after submission
        setTimeout(() => setMessageSent(false), 5000); // Clear message sent status after 5 seconds
      } else {
        alert('Failed to send message: ' + result.message);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message: ' + error.message);
    }
  };  

  return (
    <div className="mt-10 p-6 bg-white border rounded-lg shadow-lg">
      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setShowContactForm(false)}
          className="py-2 px-4 rounded-lg transition-colors hover:bg-[var(--secondary-color)]"
          style={{ backgroundColor: 'var(--primary-color)', color: 'white' }}
        >
          Contact Information
        </button>
        <button
          onClick={() => setShowContactForm(true)}
          className="py-2 px-4 rounded-lg transition-colors hover:bg-[var(--secondary-color)]"
          style={{ backgroundColor: 'var(--primary-color)', color: 'white' }}
        >
          Contact Form
        </button>
      </div>
      {showContactForm ? (
        <div className="mt-4">
          {messageSent && <p className="text-green-500 mb-4">Message has been sent!</p>}
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
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                {...register('email')}
                className="w-full p-2 border rounded-lg"
              />
              {errors.email && <p className="text-red-500">{errors.email.message}</p>}
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
              className="px-6 py-3 rounded-lg shadow-lg transition-transform transform hover:scale-105"
              style={{ backgroundColor: 'var(--primary-color)', color: 'white', hover: 'var(--secondary-color)' }}
            >
              Send Message
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
      )}
    </div>
  );
};

export default ContactSection;
