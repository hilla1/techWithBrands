// src/components/Gig.jsx
import React, { useState } from 'react';
import GigDetails from './GigDetails';
import GigPricing from './GigPricing';
import RelatedGigs from './RelatedGigs';


const Gig = () => {
  const [selectedPlan, setSelectedPlan] = useState('Basic');

  const handlePlanChange = (plan) => {
    setSelectedPlan(plan);
  };

  return (
    <div className='md:p-6'>
      <div className="flex flex-col md:flex-row">
        <GigDetails />
        <GigPricing selectedPlan={selectedPlan} handlePlanChange={handlePlanChange} />
      </div>
      <RelatedGigs />
    </div>
  );
};

export default Gig;
