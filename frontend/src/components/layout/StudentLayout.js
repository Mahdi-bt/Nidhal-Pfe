import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import GlobalHeader from '../GlobalHeader';
import { useAuth } from '../../contexts/AuthContext';

const StudentLayout = ({ children }) => {
  const location = useLocation();
  const { user } = useAuth();
  
  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <GlobalHeader />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 relative">
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 -mt-16 -mr-20 w-64 h-64 bg-indigo-200 rounded-full opacity-10 filter blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -mb-16 -ml-16 w-48 h-48 bg-blue-300 rounded-full opacity-10 filter blur-3xl"></div>
        
        {/* Content */}
        <div className="relative z-10">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="md:flex md:items-center md:justify-between">
            <div className="text-sm text-gray-500">
              © {new Date().getFullYear()} Training Center. All rights reserved.
            </div>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-500 hover:text-gray-900">Support</a>
              <a href="#" className="text-gray-500 hover:text-gray-900">Privacy Policy</a>
              <a href="#" className="text-gray-500 hover:text-gray-900">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default StudentLayout; 