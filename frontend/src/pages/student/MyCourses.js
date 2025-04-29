import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { mockApiService } from '../../services/mockData';
import { useAuth } from '../../contexts/AuthContext';
import StudentLayout from '../../components/layout/StudentLayout';

const MyCourses = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // 'all', 'in-progress', 'completed'
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (user) {
      fetchEnrolledCourses();
    }
  }, [user]);
  
  useEffect(() => {
    if (courses.length > 0) {
      filterCourses();
    }
  }, [filter, searchTerm, courses]);

  const fetchEnrolledCourses = async () => {
    try {
      const response = await mockApiService.getEnrolledCourses(user.id);
      if (response.success) {
        setCourses(response.data);
        setFilteredCourses(response.data);
      } else {
        setError(response.error);
      }
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch enrolled courses');
      setLoading(false);
    }
  };

  const filterCourses = () => {
    let result = [...courses];
    
    // Apply status filter
    if (filter === 'in-progress') {
      result = result.filter(course => course.progress > 0 && course.progress < 100);
    } else if (filter === 'completed') {
      result = result.filter(course => course.progress === 100);
    } else if (filter === 'not-started') {
      result = result.filter(course => course.progress === 0);
    }
    
    // Apply search filter
    if (searchTerm) {
      result = result.filter(
        course => course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                 course.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredCourses(result);
  };

  const getStatusClass = (progress) => {
    if (progress === 0) return 'bg-gray-100 text-gray-800';
    if (progress < 50) return 'bg-blue-100 text-blue-800';
    if (progress < 100) return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  };

  const getStatusText = (progress) => {
    if (progress === 0) return 'Not Started';
    if (progress < 50) return 'Just Started';
    if (progress < 100) return 'In Progress';
    return 'Completed';
  };

  return (
    <StudentLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Courses</h1>
        <p className="text-lg text-gray-600">
          Track your progress and continue your learning journey
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Filter and Search Section */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-8">
            <div className="md:flex md:items-center md:justify-between">
              <div className="flex flex-wrap items-center">
                <button
                  onClick={() => setFilter('all')}
                  className={`mr-2 mb-2 md:mb-0 px-4 py-2 rounded-lg text-sm font-medium ${
                    filter === 'all' 
                      ? 'bg-indigo-600 text-white' 
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
                >
                  All Courses
                </button>
                <button
                  onClick={() => setFilter('in-progress')}
                  className={`mr-2 mb-2 md:mb-0 px-4 py-2 rounded-lg text-sm font-medium ${
                    filter === 'in-progress' 
                      ? 'bg-indigo-600 text-white' 
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
                >
                  In Progress
                </button>
                <button
                  onClick={() => setFilter('completed')}
                  className={`mr-2 mb-2 md:mb-0 px-4 py-2 rounded-lg text-sm font-medium ${
                    filter === 'completed' 
                      ? 'bg-indigo-600 text-white' 
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
                >
                  Completed
                </button>
                <button
                  onClick={() => setFilter('not-started')}
                  className={`mb-2 md:mb-0 px-4 py-2 rounded-lg text-sm font-medium ${
                    filter === 'not-started' 
                      ? 'bg-indigo-600 text-white' 
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
                >
                  Not Started
                </button>
              </div>
              <div className="mt-4 md:mt-0 relative">
                <input
                  type="text"
                  placeholder="Search courses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full md:w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <svg 
                  className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" 
                  viewBox="0 0 20 20" 
                  fill="currentColor"
                >
                  <path 
                    fillRule="evenodd" 
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" 
                    clipRule="evenodd" 
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Courses Grid */}
          {filteredCourses.length === 0 ? (
            <div className="bg-white rounded-xl shadow-md p-8 text-center">
              <svg className="h-16 w-16 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 14a3.5 3.5 0 100-7 3.5 3.5 0 000 7zM21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-gray-600 mb-4">
                {searchTerm ? 
                  "No courses match your search criteria." : 
                  "You don't have any courses in this category yet."
                }
              </p>
              <Link
                to="/courses"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Browse Courses
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map((course) => (
                <div 
                  key={course.id} 
                  className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="h-48 bg-gradient-to-r from-indigo-500 to-blue-600 relative">
                    {course.thumbnail && (
                      <img
                        src={course.thumbnail}
                        alt={course.title}
                        className="w-full h-full object-cover mix-blend-overlay opacity-70"
                      />
                    )}
                    <div className="absolute top-0 left-0 w-full p-4">
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusClass(course.progress)}`}>
                        {getStatusText(course.progress)}
                      </span>
                    </div>
                    <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black/50 to-transparent">
                      <h3 className="text-white text-xl font-bold line-clamp-2">{course.title}</h3>
                    </div>
                  </div>
                  <div className="p-5">
                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium text-gray-700">Progress</span>
                        <span className="text-sm font-medium text-indigo-600">{course.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className={`h-2.5 rounded-full ${
                            course.progress === 100 
                              ? 'bg-green-600' 
                              : 'bg-indigo-600'
                          }`}
                          style={{ width: `${course.progress}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mb-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{course.duration}</span>
                      </div>
                      <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                        </svg>
                        <span>{course.level}</span>
                      </div>
                    </div>

                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{course.description}</p>

                    <div className="grid grid-cols-2 gap-2">
                      <Link
                        to={`/courses/${course.id}`}
                        className="flex justify-center items-center py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors duration-300"
                      >
                        {course.progress > 0 ? "Continue" : "Start Course"}
                      </Link>
                      <button
                        className="flex justify-center items-center py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 text-sm font-medium rounded-lg transition-colors duration-300"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </StudentLayout>
  );
};

export default MyCourses; 