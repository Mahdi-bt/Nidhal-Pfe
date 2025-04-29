import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const GlobalHeader = () => {
  const location = useLocation();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  // Modern admin-specific design elements
  const adminGradient = "bg-gradient-to-r from-indigo-600 via-blue-600 to-purple-600";
  const adminButtonGradient = "bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700";
  const regularGradient = "bg-gradient-to-r from-blue-600 to-indigo-600";
  
  // Use admin-specific styles when the user is an admin
  const navbarGradient = isAdmin ? adminGradient : regularGradient;

  return (
    <nav className={`shadow-lg ${navbarGradient} relative overflow-hidden`}>
      {/* Animated background effects - only visible for admin */}
      {isAdmin && (
        <>
          <div className="absolute w-96 h-96 bg-white/5 rounded-full -top-64 -left-20 blur-xl"></div>
          <div className="absolute w-80 h-80 bg-white/5 rounded-full -bottom-40 -right-20 blur-xl"></div>
        </>
      )}
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex justify-between h-16">
          {/* Logo and desktop navigation */}
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <Link 
                to={isAdmin ? "/admin/courses" : "/"} 
                className="flex items-center group transition-all duration-300"
              >
                <div className="p-2 rounded-lg bg-white/10 mr-2 group-hover:scale-110 transition-transform duration-200">
                  <svg className="h-7 w-7 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 4.75L19.25 9L12 13.25L4.75 9L12 4.75Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M4.75 14L12 18.25L19.25 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <span className="text-xl font-bold text-white tracking-tight">
                  Training Center
                  {isAdmin && (
                    <span className="ml-2 text-xs bg-white text-indigo-700 px-2 py-0.5 rounded-full font-semibold shadow-sm">
                      Admin
                    </span>
                  )}
                </span>
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-4">
              {/* Show Courses link only for non-admin users */}
              {!isAdmin && (
                <Link
                  to="/courses"
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 text-white hover:bg-white/10 ${
                    isActive('/courses') ? 'bg-white/20' : ''
                  }`}
                >
                  Courses
                </Link>
              )}

              {/* Links for students only */}
              {isAuthenticated && !isAdmin && (
                <Link
                  to="/my-courses"
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 text-white hover:bg-white/10 ${
                    isActive('/my-courses') ? 'bg-white/20' : ''
                  }`}
                >
                  My Courses
                </Link>
              )}

              {/* Links for admins only - with enhanced styling */}
              {isAdmin && (
                <>
                  <Link
                    to="/admin/courses"
                    className={`px-4 py-2 rounded-lg text-sm font-medium text-white transition-all duration-200 hover:bg-white/10 ${
                      isActive('/admin/courses') ? 'bg-white/20 border-b-2 border-white' : ''
                    } flex items-center space-x-1`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    <span>Manage Courses</span>
                  </Link>
                  <Link
                    to="/admin/users"
                    className={`px-4 py-2 rounded-lg text-sm font-medium text-white transition-all duration-200 hover:bg-white/10 ${
                      isActive('/admin/users') ? 'bg-white/20 border-b-2 border-white' : ''
                    } flex items-center space-x-1`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    <span>Manage Users</span>
                  </Link>
                  <Link
                    to="/admin/statistics"
                    className={`px-4 py-2 rounded-lg text-sm font-medium text-white transition-all duration-200 hover:bg-white/10 ${
                      isActive('/admin/statistics') ? 'bg-white/20 border-b-2 border-white' : ''
                    } flex items-center space-x-1`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    <span>Statistics</span>
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* User menu and mobile menu button */}
          <div className="flex items-center">
            {isAuthenticated ? (
              <div className="flex items-center">
                <div className="hidden md:flex items-center">
                  {/* Enhanced admin user profile section */}
                  <div className={`flex items-center mr-4 px-3 py-2 ${isAdmin ? 'bg-white/10' : 'bg-white/10'} text-white rounded-lg border border-white/10 shadow-sm`}>
                    <div className={`h-8 w-8 rounded-full ${isAdmin ? 'bg-purple-500' : 'bg-white/20'} flex items-center justify-center mr-2 shadow-inner`}>
                      <span className="text-sm font-medium text-white">
                        {user?.first_name?.charAt(0)}{user?.last_name?.charAt(0)}
                      </span>
                    </div>
                    <span className="text-sm font-medium">
                      {user?.first_name} {user?.last_name}
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className={`px-4 py-2 rounded-lg shadow-md text-sm font-medium text-white transition-all duration-300 transform hover:-translate-y-0.5 ${
                      isAdmin ? adminButtonGradient : 'bg-red-500 hover:bg-red-600'
                    } flex items-center`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-4">
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-lg border border-white/30 text-sm font-medium text-white hover:bg-white/10 transition-colors shadow-sm"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 rounded-lg shadow-sm text-sm font-medium text-blue-600 bg-white hover:bg-gray-100 transition-all duration-200 transform hover:-translate-y-0.5"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <div className="flex md:hidden ml-4">
              <button
                type="button"
                className="p-2 rounded-md text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 transition-colors"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <span className="sr-only">Open main menu</span>
                {mobileMenuOpen ? (
                  <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on mobile menu state */}
      <div className={`${mobileMenuOpen ? 'block' : 'hidden'} md:hidden`}>
        <div className={`px-2 pt-2 pb-3 space-y-1 ${navbarGradient}`}>
          {/* Show Courses link only for non-admin users in mobile menu */}
          {!isAdmin && (
            <Link
              to="/courses"
              className={`block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-white/10 ${
                isActive('/courses') ? 'bg-white/20' : ''
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Courses
            </Link>
          )}
          
          {isAuthenticated && !isAdmin && (
            <Link
              to="/my-courses"
              className={`block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-white/10 ${
                isActive('/my-courses') ? 'bg-white/20' : ''
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              My Courses
            </Link>
          )}

          {isAdmin && (
            <>
              <Link
                to="/admin/courses"
                className={`block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-white/10 ${
                  isActive('/admin/courses') ? 'bg-white/20' : ''
                } flex items-center`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                Manage Courses
              </Link>
              <Link
                to="/admin/users"
                className={`block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-white/10 ${
                  isActive('/admin/users') ? 'bg-white/20' : ''
                } flex items-center`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                Manage Users
              </Link>
              <Link
                to="/admin/statistics"
                className={`block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-white/10 ${
                  isActive('/admin/statistics') ? 'bg-white/20' : ''
                } flex items-center`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Statistics
              </Link>
            </>
          )}

          {isAuthenticated ? (
            <div className="border-t border-white/10 pt-4 pb-3 mt-4">
              <div className="px-3 py-2 flex items-center">
                <div className={`h-10 w-10 rounded-full ${isAdmin ? 'bg-purple-500' : 'bg-white/20'} flex items-center justify-center shadow-inner`}>
                  <span className="text-lg font-medium text-white">
                    {user?.first_name?.charAt(0)}
                  </span>
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium text-white">
                    {user?.first_name} {user?.last_name}
                  </div>
                  <div className="text-sm text-blue-100">
                    {user?.email}
                  </div>
                </div>
              </div>
              <div className="mt-3 px-2">
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className={`block w-full px-3 py-2 rounded-md text-base font-medium text-white ${
                    isAdmin ? adminButtonGradient : 'bg-red-500 hover:bg-red-600'
                  } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex items-center justify-center`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <div className="mt-4 pt-4 pb-3 border-t border-white/10">
              <div className="grid grid-cols-2 gap-3 px-3">
                <Link
                  to="/login"
                  className="px-3 py-2 rounded-md text-white border border-white/30 text-center hover:bg-white/10"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-3 py-2 rounded-md text-blue-600 bg-white text-center hover:bg-gray-100"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default GlobalHeader; 