import React from 'react';
import { Link } from 'react-router-dom';
import { FiAlertCircle, FiChevronLeft } from 'react-icons/fi';

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="text-center max-w-md">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
            <FiAlertCircle className="text-red-500 text-3xl" />
          </div>
        </div>
        <h1 className="text-4xl font-bold mb-4 text-gray-800">Page Not Found</h1>
        <p className="text-gray-600 mb-8">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <Link 
          to="/dashboard" 
          className="text-primary flex items-center justify-center hover:underline"
        >
          <FiChevronLeft className="mr-1" /> Return to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
