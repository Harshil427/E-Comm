import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaExclamationTriangle } from 'react-icons/fa';
import { Helmet } from "react-helmet";

const NotFoundPage = () => {
  return (
    <>
      <Helmet>
        <title>404 | Mera Bestie</title>
      </Helmet>
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center px-4 overflow-hidden relative">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-0 left-0 w-1/2 h-1/2 bg-pink-200 rounded-full blur-3xl filter" />
          <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-yellow-100 rounded-full blur-3xl filter" />
        </div>
        
        <div className="text-center z-10 max-w-md w-full p-8 bg-white rounded-xl shadow-2xl transform transition-all duration-300 hover:scale-105">
          <div className="relative">
            <FaExclamationTriangle className="text-yellow-500 text-6xl mb-8 mx-auto animate-bounce" />
            <div className="absolute -top-2 -right-2 w-full h-full bg-pink-100 rounded-xl -z-10 opacity-50" />
          </div>
          
          <h1 className="text-6xl font-bold text-gray-800 mb-4 tracking-tight">404</h1>
          <h2 className="text-2xl font-semibold text-gray-600 mb-6">Page Not Found</h2>
          <p className="text-gray-500 mb-8 leading-relaxed">
            Oops! The page you are looking for might have been removed or is temporarily unavailable.
          </p>
          
          <Link 
            to="/"
            className="inline-flex items-center px-6 py-3 bg-pink-500 text-white font-semibold rounded-lg 
            hover:bg-pink-600 transition duration-300 
            transform hover:-translate-y-1 hover:shadow-lg 
            active:scale-95 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:ring-offset-2"
          >
            <FaHome className="mr-2" />
            Back to Home
          </Link>
        </div>
      </div>
    </>
  );
};

export default NotFoundPage;