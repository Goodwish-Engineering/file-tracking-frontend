import React from 'react';
import { motion } from 'framer-motion';
import { MdClose } from 'react-icons/md';

const PageCountModal = ({ isOpen, onClose, type, pageCount, setPageCount, onSubmit }) => {
  if (!isOpen) return null;
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md transform transition-all"
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-[#E68332]">
            {type === "tippani" ? "टिप्पणी पृष्ठ संख्या" : "कागजात पृष्ठ संख्या"}
          </h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <MdClose className="w-6 h-6" />
          </button>
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 mb-2">पृष्ठ संख्या प्रविष्ट गर्नुहोस्:</label>
          <input
            type="number"
            min="1"
            max="100"
            value={pageCount}
            onChange={(e) => setPageCount(parseInt(e.target.value))}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#E68332] focus:border-transparent"
          />
          <p className="text-sm text-gray-500 mt-2">
            {type === "tippani"
              ? "कृपया थप्न चाहनुभएको टिप्पणी पृष्ठ संख्या प्रविष्ट गर्नुहोस्।"
              : "कृपया थप्न चाहनुभएको कागजात पृष्ठ संख्या प्रविष्ट गर्नुहोस्।"}
          </p>
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition-colors"
          >
            रद्द गर्नुहोस्
          </button>
          <button
            onClick={onSubmit}
            className="px-4 py-2 bg-[#E68332] text-white rounded-md hover:bg-[#d9773b] transition-colors"
          >
            सुनिश्चित गर्नुहोस्
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default PageCountModal;
