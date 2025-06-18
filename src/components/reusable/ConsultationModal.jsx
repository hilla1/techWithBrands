import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import axios from 'axios';
import ReusableModal from './ReusableModal';
import { useAuth } from '../../context/AuthContext';
import LoginPromptModal from './LoginPromptModal';
import LoginModal from '../Auth/LoginModal';
import { useNavigate, useLocation } from 'react-router-dom';
import CalendarWeekPicker from '../Panel/CalendarWeekPicker';
import ResponseModal from '../Panel/ResponseModal';
import { FaSpinner } from 'react-icons/fa';

const steps = ['Tell us about yourself', 'Project Details', 'Schedule Your Consultation'];
const gradient = 'bg-gradient-to-r from-[#2E3191] to-[#F89F2D]';

// Individual step schemas
const stepSchemas = [
  z.object({
    fullName: z.string().min(1, 'Full Name is required'),
    email: z.string().email('Invalid email address'),
    companyName: z.string().min(1, 'Company Name is required'),
    phoneNumber: z.string().min(10, 'Phone number is required'),
  }),
  z.object({
    services: z.array(z.string()).min(1, 'Please select at least one service'),
    budget: z.string().min(1, 'Please select a budget range'),
    timeline: z.string().min(1, 'Please select a timeline'),
    description: z.string().optional(),
  }),
  z.object({
    timeSlot: z.string().min(1, 'Please select a time slot'),
  }),
];

// Full schema combining all fields
const fullSchema = z.object({
  fullName: z.string().min(1),
  email: z.string().email(),
  companyName: z.string().min(1),
  phoneNumber: z.string().min(10),
  services: z.array(z.string()).min(1),
  budget: z.string().min(1),
  timeline: z.string().min(1),
  description: z.string().optional(),
  timeSlot: z.string().min(1),
});

const ConsultationModal = ({ isOpen, onClose }) => {
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const { user, backend, isAuthenticated, checkAuthentication} = useAuth();
  const [step, setStep] = useState(0);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [loginPromptOpen, setLoginPromptOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const navigate = useNavigate();
  const [response, setResponse] = useState(null);

  const form = useForm({
    resolver: zodResolver(fullSchema),
    mode: 'onTouched',
    defaultValues: {
      fullName: user?.name || '',
      email: user?.email || '',
      companyName: '',
      phoneNumber: '',
      services: [],
      budget: '',
      timeline: '',
      description: '',
      timeSlot: '',
    },
  });

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    trigger,
    reset,
    setValue,
  } = form;

  const services = watch('services') || [];

  const nextStep = async () => {
    // Validate only current step's fields
    const fields = Object.keys(stepSchemas[step].shape);
    const isValid = await trigger(fields);
    if (!isValid) return;

    if (step === 0 && location.pathname !== '/dashboard') {
      try {
        setLoading(true);
        const { data } = await axios.post(`${backend}/consultation/check-email`, {
          email: watch('email'),
        },);
        if (data.success) {
          setLoginPromptOpen(true);
          setLoading(false);
          return;
        }
      } catch (err) {
        setResponse({
        success: false,
        message: err.message,
      });
        setLoading(false);
        return;
      }
    }

    setStep((prev) => Math.min(prev + 1, steps.length - 1));
    setLoading(false);
  };

  const prevStep = () => setStep((prev) => Math.max(prev - 1, 0));

  // Form submission
  const onSubmit = async (data) => {
  try {
    setLoading(true);
    const response = await axios.post(`${backend}/consultation/create-consultation`, data, { withCredentials: true });

    if (response.data.success) {
      onClose();
      setSuccessModalOpen(true); 
      await checkAuthentication(); 
    } else {
      setResponse(response.data);
    }
  } catch (error) { 
    setResponse({
        success: false,
        message: error.message,
      });
  } finally {
    setLoading(false);
  }
 };

  // Reset and close modal after 2 seconds
  useEffect(() => {
  if (successModalOpen) {
    const timer = setTimeout(() => {
      setSuccessModalOpen(false);
      setStep(0);
      reset();
    }, 2000);

    return () => clearTimeout(timer);
  }
  }, [successModalOpen, reset]);

 // Redirect if authenticated and modal was just shown
  useEffect(() => {
  if (isAuthenticated && location.pathname !== '/dashboard') {
    const timer = setTimeout(() => {
      navigate('/dashboard');
    }, 2000);

    return () => clearTimeout(timer);
  }
  }, [isAuthenticated, successModalOpen, navigate, location.pathname]);

  const renderStepContent = () => {
    const inputClass = 'input w-full p-2 border border-gray-300 rounded';
    switch (step) {
      case 0:
        return (
          <>
            <h3 className="text-lg font-bold mb-2">Tell us about yourself</h3>
            <p className="mb-4 text-gray-500 text-sm">
              We'll use this information to prepare for your consultation
            </p>
            <input {...register('fullName')} placeholder="Full Name *" className={inputClass} />
            {errors.fullName && <p className="text-red-500 text-sm">{errors.fullName.message}</p>}
            <input {...register('email')} placeholder="Email Address *" className={inputClass} type="email" />
            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
            <input {...register('companyName')} placeholder="Company Name *" className={inputClass} />
            {errors.companyName && <p className="text-red-500 text-sm">{errors.companyName.message}</p>}
            <input {...register('phoneNumber')} placeholder="Phone Number" className={inputClass} type="tel" />
            {errors.phoneNumber && <p className="text-red-500 text-sm">{errors.phoneNumber.message}</p>}
          </>
        );

      case 1:
        return (
          <>
            <h3 className="text-lg font-bold mb-2">Project Details</h3>
            <p className="mb-4 text-gray-500 text-sm">Help us understand your needs better</p>
            <div className="grid grid-cols-2 gap-2 mb-2 text-sm">
              {[
                'Digital Transformation',
                'Brand Technology Strategy',
                'Customer Experience Tech',
                'Process Automation',
                'Cloud Migration',
                'System Integration',
                'CRM Implementation',
                'Analytics & Insights',
              ].map((service) => (
                <label key={service} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    value={service}
                    {...register('services')}
                    checked={services.includes(service)}
                    onChange={() => {
                      const updated = services.includes(service)
                        ? services.filter((s) => s !== service)
                        : [...services, service];
                      setValue('services', updated, { shouldValidate: true });
                    }}
                  />
                  <span>{service}</span>
                </label>
              ))}
            </div>
            {errors.services && <p className="text-red-500 text-sm">{errors.services.message}</p>}
            <select {...register('budget')} className={inputClass} defaultValue="">
              <option value="" disabled>
                Select budget range
              </option>
              <option>Below $500</option>
              <option>$500 - $1,000</option>
              <option>$1,000 - $2,500</option>
              <option>$2,500 - $5,000</option>
              <option>Above $5,000</option>
            </select>
            {errors.budget && <p className="text-red-500 text-sm">{errors.budget.message}</p>}
            <select {...register('timeline')} className={inputClass} defaultValue="">
              <option value="" disabled>
                Select timeline
              </option>
              <option>Immediately</option>
              <option>1-3 months</option>
              <option>3-6 months</option>
              <option>6+ months</option>
            </select>
            {errors.timeline && <p className="text-red-500 text-sm">{errors.timeline.message}</p>}
            <textarea
              {...register('description')}
              placeholder="Project Description"
              className={inputClass}
              rows="3"
            />
          </>
        );

      case 2:
      return (
        <>
         <h3 className="text-lg font-bold mb-2">Schedule Your Consultation</h3>
         <p className="mb-4 text-gray-500 text-sm">Choose a time that works best for you</p>

          {/* 🗓️ Custom Calendar Picker */}
           <CalendarWeekPicker
            onDateSelect={({ date, formatted }) => {
            setValue('timeSlot', formatted, { shouldValidate: true });
           }}
           />

             {/*Validation error */}
            {errors.timeSlot && <p className="text-red-500 text-sm">{errors.timeSlot.message}</p>}

            <div className="bg-gray-100 p-3 rounded-md text-sm text-gray-700 mt-4">
            <p><strong>What to Expect</strong></p>
           <ul className="list-disc ml-5">
            <li>45-minute session</li>
            <li>Deep dive into your needs</li>
            <li>Custom strategy & tailored recommendations</li>
            <li>Clear action plan</li>
           </ul>
         </div>
         </>
        );


      default:
        return null;
    }
  };

  return (
    <>
      <ReusableModal isOpen={isOpen} onClose={onClose}>
        <div className="pt-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Progress bar */}
            <div className="w-full h-2 rounded bg-gray-200 overflow-hidden">
              <div className={`${gradient} h-full`} style={{ width: `${((step + 1) / 3) * 100}%` }}></div>
            </div>
            <div className="text-center">
              <h2 className="text-xl font-bold">Book Your Free Consultation</h2>
              <p className="text-sm text-gray-500">Step {step + 1} of {steps.length}</p>
            </div>
            <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-1">{renderStepContent()}</div>
            <div className="flex justify-between items-center pt-4">
              {step > 0 && (
                <button
                  type="button"
                  onClick={prevStep}
                  className="px-4 py-2 text-sm text-white rounded bg-[#F89F2D] hover:bg-[#d78e4e]"
                >
                  Back
                </button>
              )}
              {step < steps.length - 1 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="ml-auto px-4 py-2 text-sm text-white rounded bg-[#2E3191] hover:bg-[#F89F2D]"
                >
                {loading ? (<div className='flex items-center justify-between gap-2'><FaSpinner className="animate-spin" />checking..</div> ) :'Continue'}
                </button>
              ) : (
              <button
                type="submit"
                disabled={loading}
                className={`ml-auto px-4 py-2 text-sm text-white rounded bg-green-500 hover:bg-green-600 flex items-center gap-2 ${
                  loading ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {loading ? (
                <div className='flex items-center justify-between gap-2'><FaSpinner className="animate-spin" />Booking...</div>
                ) : (
                  'Book Consultation'
                )}
              </button>
              )}
            </div>
          </form>
        </div>
      </ReusableModal>

      {/* Success Modal */}
      <ReusableModal isOpen={successModalOpen} onClose={() => setSuccessModalOpen(false)}>
        <div className="text-center space-y-4 p-6">
          <h3 className="text-2xl font-bold text-green-600">Thank you!</h3>
          <p>Your consultation has been booked successfully. We will contact you shortly to confirm the details.</p>
        </div>
      </ReusableModal>

      {/* Login Prompt Modal */}
      <LoginPromptModal
        isOpen={loginPromptOpen}
        onClose={() => setLoginPromptOpen(false)}
        openLoginModal={() => { onClose(); setLoginModalOpen(true); }}
      />

      <LoginModal isOpen={loginModalOpen} onClose={() => setLoginModalOpen(false)} />

      <ResponseModal
        response={response}
        onClose={() => {
          setResponse(null);
          onClose(); 
        }}
      />
    </>
  );
};

export default ConsultationModal;
