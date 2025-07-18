import React from 'react';

const Card = ({
  children,
  className = '',
  header,
  title,
  subtitle,
  icon,
  variant = 'default',
  ...props
}) => {
  const baseClasses = 'bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 transition-all hover:shadow-xl';
  
  const variants = {
    default: '',
    gradient: 'bg-gradient-to-r from-[#f9f1ea] to-[#fcf8f5]',
    bordered: 'border-l-4 border-[#E68332]'
  };

  return (
    <div className={`${baseClasses} ${variants[variant]} ${className}`} {...props}>
      {(header || title || subtitle) && (
        <div className="bg-gradient-to-r from-[#f9f1ea] to-[#fcf8f5] p-4 border-l-4 border-[#E68332]">
          {header || (
            <>
              {title && (
                <h2 className="text-xl font-bold text-[#E68332] flex items-center gap-2">
                  {icon && icon}
                  {title}
                </h2>
              )}
              {subtitle && (
                <p className="text-gray-600 mt-1">{subtitle}</p>
              )}
            </>
          )}
        </div>
      )}
      <div className="p-6">
        {children}
      </div>
    </div>
  );
};

export default Card;
