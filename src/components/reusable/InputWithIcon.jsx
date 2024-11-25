// src/components/InputWithIcon.jsx

import React from 'react';

const InputWithIcon = ({ label, icon, ...rest }) => (
  <div className="relative">
    <label className="block text-gray-600 mb-2">{label}</label>
    <div className="relative">
      {icon && <span className="absolute top-1/2 transform -translate-y-1/2 left-3 text-gray-400">{icon}</span>}
      <input {...rest} className="w-full pl-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[--primary-color]" />
    </div>
  </div>
);

export default InputWithIcon;
