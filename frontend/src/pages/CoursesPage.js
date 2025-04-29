"use client"

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { mockApiService } from '../services/mockData';
import Layout from '../components/layout/Layout';

const CoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    fetchCourses();
    // Add animation effect when component mounts
    setTimeout(() => setFadeIn(true), 100);
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await mockApiService.getCourses();
      if (response.success) {
        setCourses(response.data);
      } else {
        setError(response.error);
      }
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch courses');
      setLoading(false);
    }
  };

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || course.category === selectedCategory;
    const matchesLevel = !selectedLevel || course.level === selectedLevel;
    return matchesSearch && matchesCategory && matchesLevel;
  });

  const categories = [...new Set(courses.map(course => course.category))];
  const levels = ['Beginner', 'Intermediate', 'Advanced'];

  // Get color based on course level
  const getLevelColor = (level) => {
    switch(level) {
      case 'Beginner': return 'bg-emerald-100 text-emerald-800';
      case 'Intermediate': return 'bg-blue-100 text-blue-800';
      case 'Advanced': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="h-96 flex justify-center items-center">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-600 mb-4"></div>
            <p className="text-gray-600 text-lg">Loading amazing courses for you...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="max-w-3xl mx-auto my-12 bg-red-50 border-l-4 border-red-500 p-6 rounded-lg">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-red-800">Something went wrong</h3>
              <p className="mt-2 text-red-700">{error}</p>
              <button 
                onClick={fetchCourses} 
                className="mt-4 px-4 py-2 bg-red-100 text-red-800 rounded-md hover:bg-red-200 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className={`transition-opacity duration-500 ${fadeIn ? 'opacity-100' : 'opacity-0'}`}>
        {/* Hero section */}
        <div className="bg-gradient-to-r from-indigo-600 to-blue-500 text-white rounded-2xl overflow-hidden shadow-xl mb-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-white opacity-10 rounded-full filter blur-3xl"></div>
            <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-60 h-60 bg-blue-300 opacity-10 rounded-full filter blur-3xl"></div>
            
            <div className="relative z-10 text-center md:text-left md:w-2/3">
              <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
                Explore Our Courses
              </h1>
              <p className="text-xl md:text-2xl text-blue-100 mb-8">
                Find the perfect course to advance your career and skills
              </p>
              <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
                <a href="#courses-section" className="px-6 py-3 bg-white text-indigo-700 rounded-lg font-medium text-lg hover:bg-indigo-50 transition-colors shadow-md">
                  Browse Courses
                </a>
                <a href="#" className="px-6 py-3 bg-indigo-700 text-white rounded-lg font-medium text-lg hover:bg-indigo-800 transition-colors border border-indigo-300">
                  View Learning Paths
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Filters section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white p-6 rounded-xl shadow-md mb-10">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search courses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              <div>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none bg-white"
                  style={{ 
                    backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                    backgroundPosition: 'right 0.5rem center',
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: '1.5em 1.5em',
                    paddingRight: '2.5rem'
                  }}
                >
                  <option value="">All Categories</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              <div>
                <select
                  value={selectedLevel}
                  onChange={(e) => setSelectedLevel(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none bg-white"
                  style={{ 
                    backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                    backgroundPosition: 'right 0.5rem center',
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: '1.5em 1.5em',
                    paddingRight: '2.5rem'
                  }}
                >
                  <option value="">All Levels</option>
                  {levels.map(level => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Course count */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800" id="courses-section">
              {filteredCourses.length} {filteredCourses.length === 1 ? 'Course' : 'Courses'} Available
            </h2>
            <div className="text-gray-500 text-sm">
              Showing {filteredCourses.length} of {courses.length} courses
            </div>
          </div>

          {/* Course Grid */}
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 mb-16">
            {filteredCourses.map((course, index) => (
              <div 
                key={course.id} 
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1 transition-transform"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="relative">
                  {course.thumbnail ? (
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-full h-52 object-cover"
                    />
                  ) : (
                    <div className="w-full h-52 bg-gradient-to-r from-blue-400 to-indigo-500 flex items-center justify-center">
                      <span className="text-white text-2xl font-bold">{course.title.substring(0, 2).toUpperCase()}</span>
                    </div>
                  )}
                  <div className="absolute top-4 right-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getLevelColor(course.level)}`}>
                      {course.level}
                    </span>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex items-center space-x-2 mb-2 text-sm text-gray-500">
                    <span className="flex items-center">
                      <svg className="h-4 w-4 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      {course.duration}
                    </span>
                    <span>•</span>
                    <span className="flex items-center">
                      <svg className="h-4 w-4 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      {course.enrolled_students} students
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 h-14">{course.title}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-2 h-12">{course.description}</p>
                  
                  <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                    <div className="flex items-end">
                      <span className="text-2xl font-bold text-indigo-600">${course.price}</span>
                      {course.original_price && (
                        <span className="ml-2 text-sm text-gray-500 line-through">${course.original_price}</span>
                      )}
                    </div>
                    <Link
                      to={`/courses/${course.id}`}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty state */}
          {filteredCourses.length === 0 && (
            <div className="bg-white rounded-xl shadow-md p-12 text-center">
              <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              <h3 className="mt-4 text-lg font-medium text-gray-900">No courses found</h3>
              <p className="mt-2 text-gray-500 max-w-md mx-auto">
                We couldn't find any courses matching your search criteria. Try adjusting your filters or search term.
              </p>
              <div className="mt-6">
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('');
                    setSelectedLevel('');
                  }}
                  className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-md hover:bg-indigo-200 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Call to action */}
        <div className="bg-indigo-700 text-white rounded-2xl overflow-hidden shadow-xl my-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-12 px-6 md:py-16 md:px-12 md:flex md:items-center md:justify-between">
            <div className="md:w-2/3 mb-8 md:mb-0">
              <h2 className="text-3xl font-extrabold mb-4">Ready to advance your skills?</h2>
              <p className="text-xl text-indigo-100">
                Join thousands of students already learning with us. Start your journey today!
              </p>
            </div>
            <div>
              <a 
                href="#" 
                className="inline-flex px-6 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-white hover:bg-indigo-50 shadow-md"
              >
                Get Started
              </a>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CoursesPage;
