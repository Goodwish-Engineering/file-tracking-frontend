import React from 'react';

const ActionButton = ({ 
  onClick, 
  icon: Icon,
  title,
  variant = 'primary',
  size = 'md',
  className = "",
  disabled = false,
  type = 'button',
  children,
  ...props
}) => {
  // If used as icon button (old API)
  if (Icon && !children) {
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
        type={type}
        onClick={onClick}
        className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        title={title}
        disabled={disabled}
        {...props}
      >
        <Icon />
      </button>
    );
  }

  // If used as text button (new API)
  const baseClasses = "font-medium rounded-lg transition-all duration-200 flex items-center justify-center";
  
  const variants = {
    primary: "bg-[#E68332] text-white hover:bg-[#CC651F] focus:ring-4 focus:ring-[#E68332]/20",
    secondary: "bg-gray-500 text-white hover:bg-gray-600 focus:ring-4 focus:ring-gray-500/20",
    success: "bg-green-600 text-white hover:bg-green-700 focus:ring-4 focus:ring-green-600/20",
    danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-4 focus:ring-red-600/20",
    outline: "border-2 border-[#E68332] text-[#E68332] hover:bg-[#E68332] hover:text-white focus:ring-4 focus:ring-[#E68332]/20"
  };
  
  const sizes = {
    sm: "px-3 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg"
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      title={title}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export default ActionButton;
