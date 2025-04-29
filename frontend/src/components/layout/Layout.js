import React from 'react';
import GlobalHeader from '../GlobalHeader';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-100">
      <GlobalHeader />

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
};

export default Layout; 