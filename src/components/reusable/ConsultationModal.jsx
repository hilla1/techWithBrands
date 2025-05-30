import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import ReusableModal from './ReusableModal';

const steps = ['Tell us about yourself', 'Project Details', 'Schedule Your Consultation'];
const gradient = 'bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600';

// Zod schemas for each step validation
const stepSchemas = [
  z.object({
    fullName: z.string().min(1, 'Full Name is required'),
    email: z.string().email('Invalid email address'),
    companyName: z.string().min(1, 'Company Name is required'),
    phoneNumber: z.string().optional(),
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

// Combine all schemas for full form submission validation (optional)
const fullSchema = stepSchemas.reduce((acc, schema) => acc.merge(schema), z.object({}));

const ConsultationModal = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(0);
  const [successModalOpen, setSuccessModalOpen] = useState(false);

  const form = useForm({
    resolver: zodResolver(stepSchemas[step]),
    mode: 'onTouched',
    defaultValues: {
      fullName: '',
      email: '',
      companyName: '',
      phoneNumber: '',
      services: [],
      budget: '',
      timeline: '',
      description: '',
      timeSlot: '',
    },
  });

  const { register, handleSubmit, watch, formState: { errors }, trigger, reset } = form;

  const nextStep = async () => {
    const valid = await trigger();
    if (valid) {
      setStep((prev) => Math.min(prev + 1, 2));
    }
  };

  const prevStep = () => setStep((prev) => Math.max(prev - 1, 0));

  const onSubmit = (data) => {
    console.log('Final submission:', data);
    onClose(); // Close main modal first
    setTimeout(() => {
      setSuccessModalOpen(true);
    }, 300);
  };

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

  // Services array watch for checkbox checked state
  const services = watch('services') || [];

  const renderStepContent = () => {
    const inputClass = "input w-full p-2 border border-gray-300 rounded";

    switch (step) {
      case 0:
        return (
          <>
            <h3 className="text-lg font-bold mb-2">Tell us about yourself</h3>
            <p className="mb-4 text-gray-500 text-sm">We'll use this information to prepare for your consultation</p>
            <input
              {...register('fullName')}
              placeholder="Full Name *"
              className={inputClass}
            />
            {errors.fullName && <p className="text-red-500 text-sm">{errors.fullName.message}</p>}

            <input
              {...register('email')}
              placeholder="Email Address *"
              className={inputClass}
              type="email"
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}

            <input
              {...register('companyName')}
              placeholder="Company Name *"
              className={inputClass}
            />
            {errors.companyName && <p className="text-red-500 text-sm">{errors.companyName.message}</p>}

            <input
              {...register('phoneNumber')}
              placeholder="Phone Number"
              className={inputClass}
              type="tel"
            />
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
                      const newServices = services.includes(service)
                        ? services.filter((s) => s !== service)
                        : [...services, service];
                      form.setValue('services', newServices, { shouldValidate: true });
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
              <option>Below $5,000</option>
              <option>$5,000 - $10,000</option>
              <option>$10,000 - $25,000</option>
              <option>$25,000 - $50,000</option>
              <option>Above $50,000</option>
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
            <div className="grid grid-cols-2 gap-2 mb-4 text-sm">
              {[
                'Tomorrow, 2:00 PM EST',
                'Tomorrow, 4:00 PM EST',
                'Friday, 10:00 AM EST',
                'Friday, 2:00 PM EST',
                'Monday, 9:00 AM EST',
                'Monday, 3:00 PM EST',
              ].map((slot) => (
                <label key={slot} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    {...register('timeSlot')}
                    value={slot}
                    checked={watch('timeSlot') === slot}
                  />
                  <span>{slot}</span>
                </label>
              ))}
            </div>
            {errors.timeSlot && <p className="text-red-500 text-sm">{errors.timeSlot.message}</p>}

            <div className="bg-gray-100 p-3 rounded-md text-sm text-gray-700">
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
      <ReusableModal
        isOpen={isOpen}
        onClose={onClose}
      >
        <div className='pt-6'>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Progress Bar */}
          <div className="w-full h-2 rounded bg-gray-200 overflow-hidden">
            <div className={`${gradient} h-full`} style={{ width: `${((step + 1) / 3) * 100}%` }}></div>
          </div>

          {/* Step Title */}
          <div className="text-center">
            <h2 className="text-xl font-bold">Book Your Free Consultation</h2>
            <p className="text-sm text-gray-500">Step {step + 1} of 3</p>
          </div>

          {/* Step Content */}
          <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-1">
            {renderStepContent()}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center pt-4">
            {step > 0 && (
              <button
                type="button"
                onClick={prevStep}
                className="px-4 py-2 text-sm text-white rounded bg-gray-400 hover:bg-gray-500"
              >
                Back
              </button>
            )}
            {step < 2 ? (
              <button
                type="button"
                onClick={nextStep}
                className="ml-auto px-4 py-2 text-sm text-white rounded bg-orange-500 hover:bg-orange-600"
              >
                Continue
              </button>
            ) : (
              <button
                type="submit"
                className="ml-auto px-4 py-2 text-sm text-white rounded bg-green-500 hover:bg-green-600"
              >
                Book Consultation
              </button>
            )}
          </div>
        </form>
        </div>
      </ReusableModal>

      <ReusableModal isOpen={successModalOpen} onClose={() => setSuccessModalOpen(false)}>
        <div className="text-center space-y-4 p-6">
          <h3 className="text-2xl font-bold text-green-600">Thank you!</h3>
          <p>Your consultation has been booked successfully. We will contact you shortly to confirm the details.</p>
        </div>
      </ReusableModal>
    </>
  );
};

export default ConsultationModal;
