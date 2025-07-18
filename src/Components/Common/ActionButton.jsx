import React from 'react';

const ActionButton = ({ 
  onClick, 
  icon: Icon, 
  title, 
  variant = 'primary',
  size = 'md',
  className = "",
  disabled = false
}) => {
  const baseClasses = "transition-colors rounded-full";
  
  const variants = {
    primary: "text-blue-600 hover:bg-blue-50",
    success: "text-green-600 hover:bg-green-50", 
    warning: "text-orange-500 hover:bg-orange-50",
    danger: "text-red-600 hover:bg-red-50"
  };
  
  const sizes = {
    sm: "p-1 text-sm",
    md: "p-2 text-lg",
    lg: "p-3 text-xl"
  };

  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      title={title}
      disabled={disabled}
    >
      <Icon />
    </button>
  );
};

export default ActionButton;
