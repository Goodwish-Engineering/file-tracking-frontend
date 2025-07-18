import React from 'react';
import { FaSpinner } from 'react-icons/fa';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  icon,
  className = '',
  onClick,
  type = 'button',
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variants = {
    primary: 'bg-[#E68332] text-white hover:bg-[#c36f2a] focus:ring-[#E68332]',
    secondary: 'bg-gray-500 text-white hover:bg-gray-600 focus:ring-gray-500',
    success: 'bg-green-500 text-white hover:bg-green-600 focus:ring-green-500',
    danger: 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-500',
    warning: 'bg-yellow-500 text-white hover:bg-yellow-600 focus:ring-yellow-500',
    outline: 'border border-[#E68332] text-[#E68332] hover:bg-[#E68332] hover:text-white focus:ring-[#E68332]',
    ghost: 'text-[#E68332] hover:bg-[#E68332] hover:bg-opacity-10 focus:ring-[#E68332]'
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };

  const isDisabled = disabled || isLoading;

  return (
    <button
      type={type}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
      onClick={onClick}
      disabled={isDisabled}
      {...props}
    >
      {isLoading ? (
        <FaSpinner className="animate-spin" />
      ) : icon ? (
        icon
      ) : null}
      {children}
    </button>
  );
};

export default Button;
