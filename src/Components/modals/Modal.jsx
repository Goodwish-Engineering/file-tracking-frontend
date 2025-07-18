import React from 'react';

const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  icon: Icon,
  children,
  footer,
  size = 'md',
  className = ""
}) => {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl',
    full: 'max-w-[90%]'
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center backdrop-blur-sm backdrop-filter transition-opacity duration-300">
      <div className={`bg-white rounded-lg shadow-xl w-[90%] ${sizeClasses[size]} max-h-[90vh] overflow-hidden animate-scaleIn ${className}`}>
        {/* Header */}
        <div className="bg-gradient-to-r from-[#E68332] to-[#FF9F4A] p-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            {Icon && <Icon className="text-white" />}
            {title}
          </h2>
          <button 
            onClick={onClose} 
            className="text-white hover:text-gray-200 transition-colors text-2xl"
          >
            &times;
          </button>
        </div>
        
        {/* Content */}
        {children}
        
        {/* Footer */}
        {footer && (
          <div className="bg-gray-50 px-6 py-4 flex justify-end">
            {footer}
          </div>
        )}
      </div>
      
      <style jsx>{`
        @keyframes scaleIn {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        
        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Modal;
