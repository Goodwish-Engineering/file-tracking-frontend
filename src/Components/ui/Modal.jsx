import React, { useEffect, useRef } from 'react';
import { FaTimes } from 'react-icons/fa';
import Button from './Button';

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'md',
  className = '',
  showCloseButton = true,
  closeOnBackdrop = true,
  ...props
}) => {
  const modalRef = useRef(null);

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl',
    full: 'max-w-[90vw]'
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (closeOnBackdrop && modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose, closeOnBackdrop]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center backdrop-blur-sm transition-opacity duration-300">
      <div
        ref={modalRef}
        className={`bg-white rounded-lg shadow-xl w-[90%] ${sizes[size]} max-h-[90vh] overflow-hidden animate-scaleIn ${className}`}
        {...props}
      >
        {title && (
          <div className="bg-gradient-to-r from-[#E68332] to-[#FF9F4A] p-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              {title}
            </h2>
            {showCloseButton && (
              <button
                onClick={onClose}
                className="text-white hover:text-gray-200 transition-colors text-2xl"
              >
                <FaTimes />
              </button>
            )}
          </div>
        )}
        
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {children}
        </div>
        
        {footer && (
          <div className="bg-gray-50 px-6 py-4 flex justify-end gap-2">
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
