import React from 'react';
import { FaUserAlt } from 'react-icons/fa';

const EmptyState = ({ 
  icon: Icon = FaUserAlt,
  title = "कुनै डाटा फेला परेन",
  description = "हाल सिस्टममा कुनै डाटा उपलब्ध छैन।"
}) => (
  <div className="text-center py-12 bg-white rounded-lg shadow-md">
    <Icon className="text-gray-300 text-5xl mx-auto mb-4" />
    <p className="text-gray-600 font-medium">{title}</p>
    <p className="text-gray-500 mt-2">{description}</p>
  </div>
);

export default EmptyState;
