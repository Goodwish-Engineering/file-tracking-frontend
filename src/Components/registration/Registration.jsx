import React from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import SimpleRegistration from '../../Components/registration/SimpleRegistration';

const Registration = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f9f1ea] via-white to-[#fcf8f5] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        

        {/* Registration Form */}
        <SimpleRegistration />

        {/* Toast Container */}
        <ToastContainer 
          position="top-right"
          autoClose={4000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          toastClassName="text-sm"
        />
      </div>
    </div>
  );
};

export default Registration;
