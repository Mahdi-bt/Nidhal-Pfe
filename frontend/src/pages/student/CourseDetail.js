import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import StudentLayout from '../../components/layout/StudentLayout';
import { useAuth } from '../../contexts/AuthContext';

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [purchasing, setPurchasing] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [enrolled, setEnrolled] = useState(false);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:5000/api/courses/${id}`);
        setCourse(response.data);
        
        // Check if user is enrolled in this course
        if (user) {
          try {
            const enrollmentResponse = await axios.get(
              `http://localhost:5000/api/users/${user.id}/enrollments`,
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem('token')}`
                }
              }
            );
            setEnrolled(enrollmentResponse.data.some(enrollment => enrollment.course_id === parseInt(id)));
          } catch (err) {
            console.error('Failed to check enrollment status:', err);
          }
        }
        
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch course details');
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id, user]);

  const handlePurchase = async () => {
    try {
      setPurchasing(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        navigate('/login');
        return;
      }

      await axios.post(
        `http://localhost:5000/api/courses/${id}/purchase`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setEnrolled(true);
      setPurchasing(false);
    } catch (err) {
      setError('Failed to purchase course');
      setPurchasing(false);
    }
  };

  // Mock data for the lessons tab
  const mockLessons = [
    { id: 1, title: 'Introduction to the Course', duration: '20 min', completed: true },
    { id: 2, title: 'Getting Started with the Basics', duration: '35 min', completed: true },
    { id: 3, title: 'Core Concepts', duration: '45 min', completed: false },
    { id: 4, title: 'Advanced Techniques', duration: '55 min', completed: false },
    { id: 5, title: 'Practical Applications', duration: '50 min', completed: false },
    { id: 6, title: 'Final Project', duration: '120 min', completed: false },
  ];

  // Mock data for the reviews tab
  const mockReviews = [
    { id: 1, user: 'Sarah Johnson', rating: 5, comment: 'Excellent course! Very well explained and the examples really helped me understand the concepts.', date: '2023-06-15' },
    { id: 2, user: 'Michael Chen', rating: 4, comment: 'Great material, though I wish there were more practical exercises.', date: '2023-05-22' },
    { id: 3, user: 'Emma Davis', rating: 5, comment: 'The instructor is amazing. Clear explanations and good pacing.', date: '2023-04-10' },
  ];

  if (loading) {
    return (
      <StudentLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      </StudentLayout>
    );
  }
  
  if (error) {
    return (
      <StudentLayout>
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
      </StudentLayout>
    );
  }
  
  if (!course) {
    return (
      <StudentLayout>
        <div className="text-center py-16">
          <h2 className="text-2xl font-bold text-gray-800">Course not found</h2>
          <p className="mt-2 text-gray-600">The course you are looking for does not exist or has been removed.</p>
          <Link 
            to="/courses" 
            className="mt-6 inline-block px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Browse Courses
          </Link>
        </div>
      </StudentLayout>
    );
  }

  return (
    <StudentLayout>
      {/* Course Hero Section */}
      <div className="bg-gradient-to-r from-indigo-700 to-purple-700 text-white rounded-xl overflow-hidden shadow-xl mb-8">
        <div className="relative">
          {course.thumbnail && (
            <img
              src={course.thumbnail}
              alt={course.title}
              className="w-full h-64 object-cover mix-blend-overlay opacity-40"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/90 to-transparent"></div>
          <div className="absolute bottom-0 left-0 w-full p-8">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="px-3 py-1 bg-white/20 rounded-full text-sm font-medium backdrop-blur-sm">
                {course.level}
              </span>
              <span className="px-3 py-1 bg-white/20 rounded-full text-sm font-medium backdrop-blur-sm">
                {course.category}
              </span>
              <span className="px-3 py-1 bg-white/20 rounded-full text-sm font-medium backdrop-blur-sm">
                {course.duration}
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">{course.title}</h1>
            <p className="text-blue-50 text-lg max-w-3xl">{course.description}</p>
          </div>
        </div>
        <div className="bg-indigo-800 p-4">
          <div className="flex flex-wrap justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-blue-200">Instructor</p>
                <p className="font-medium">{course.instructor || 'John Doe'}</p>
              </div>
            </div>
            <div className="mt-4 md:mt-0">
              <div className="flex items-baseline">
                <span className="text-3xl font-bold">${course.price}</span>
                {course.original_price && (
                  <span className="ml-2 text-lg text-blue-200 line-through">
                    ${course.original_price}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Course Content Tabs */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
        <div className="border-b border-gray-200">
          <nav className="flex">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-6 py-4 text-sm font-medium ${
                activeTab === 'overview'
                  ? 'text-indigo-600 border-b-2 border-indigo-600'
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('curriculum')}
              className={`px-6 py-4 text-sm font-medium ${
                activeTab === 'curriculum'
                  ? 'text-indigo-600 border-b-2 border-indigo-600'
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Curriculum
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`px-6 py-4 text-sm font-medium ${
                activeTab === 'reviews'
                  ? 'text-indigo-600 border-b-2 border-indigo-600'
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Reviews
            </button>
          </nav>
        </div>
        
        <div className="p-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">About This Course</h2>
              <p className="text-gray-700 mb-6">
                {course.full_description || course.description}
              </p>

              {course.prerequisites && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Prerequisites</h3>
                  <p className="text-gray-700">{course.prerequisites}</p>
                </div>
              )}

              {course.learning_objectives && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">What You'll Learn</h3>
                  <ul className="space-y-2">
                    {course.learning_objectives.map((objective, index) => (
                      <li key={index} className="flex items-start">
                        <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-gray-700">{objective}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="bg-indigo-50 p-6 rounded-lg border border-indigo-100">
                <h3 className="text-lg font-semibold text-indigo-800 mb-3">Course Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-indigo-600 font-medium">Duration</p>
                    <p className="text-gray-700">{course.duration}</p>
                  </div>
                  <div>
                    <p className="text-sm text-indigo-600 font-medium">Level</p>
                    <p className="text-gray-700">{course.level}</p>
                  </div>
                  <div>
                    <p className="text-sm text-indigo-600 font-medium">Category</p>
                    <p className="text-gray-700">{course.category}</p>
                  </div>
                  <div>
                    <p className="text-sm text-indigo-600 font-medium">Last Updated</p>
                    <p className="text-gray-700">{course.updated_at || 'Recently'}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Curriculum Tab */}
          {activeTab === 'curriculum' && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Course Curriculum</h2>
              <p className="text-gray-600 mb-6">
                {mockLessons.length} lessons • {course.duration} total
              </p>

              <div className="space-y-3">
                {mockLessons.map((lesson, index) => (
                  <div 
                    key={lesson.id} 
                    className="flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center">
                      <div className="mr-4 flex-shrink-0">
                        {lesson.completed ? (
                          <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                            <svg className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        ) : (
                          <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
                            <span className="text-gray-600 font-medium">{index + 1}</span>
                          </div>
                        )}
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{lesson.title}</h3>
                        <p className="text-sm text-gray-500">{lesson.duration}</p>
                      </div>
                    </div>
                    {enrolled ? (
                      <button 
                        className={`px-4 py-1 rounded-lg text-sm font-medium ${
                          lesson.completed 
                            ? 'bg-green-100 text-green-700'
                            : 'bg-indigo-100 text-indigo-700'
                        }`}
                      >
                        {lesson.completed ? 'Completed' : 'Start'}
                      </button>
                    ) : (
                      <div className="text-sm text-gray-500">
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Reviews Tab */}
          {activeTab === 'reviews' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Student Reviews</h2>
                <div className="flex items-center">
                  <span className="text-3xl font-bold text-indigo-600 mr-2">4.8</span>
                  <div>
                    <div className="flex text-yellow-400">
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </div>
                    <p className="text-sm text-gray-500">{mockReviews.length} reviews</p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                {mockReviews.map(review => (
                  <div key={review.id} className="border-b border-gray-200 pb-6 last:border-b-0">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
                          <span className="font-medium text-indigo-800">{review.user.charAt(0)}</span>
                        </div>
                        <span className="font-medium text-gray-900">{review.user}</span>
                      </div>
                      <span className="text-sm text-gray-500">{review.date}</span>
                    </div>
                    <div className="flex text-yellow-400 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <svg 
                          key={i} 
                          className="h-4 w-4" 
                          fill={i < review.rating ? "currentColor" : "none"}
                          stroke={i < review.rating ? "none" : "currentColor"}
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <p className="text-gray-700">{review.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Action Card */}
      <div className="bg-white rounded-xl shadow-md p-6">
        {enrolled ? (
          <div className="text-center">
            <h3 className="text-xl font-bold text-gray-900 mb-2">You are enrolled in this course</h3>
            <p className="text-gray-600 mb-6">Continue your learning journey right away!</p>
            <Link 
              to={`/my-courses`}
              className="block w-full md:w-auto md:inline-block px-6 py-3 bg-indigo-600 text-white text-center rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Go to Course
            </Link>
          </div>
        ) : (
          <div className="text-center">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Ready to start learning?</h3>
            <p className="text-gray-600 mb-6">Enroll now to get access to all course materials!</p>
            <button
              onClick={handlePurchase}
              disabled={purchasing}
              className="block w-full md:w-auto md:inline-block px-6 py-3 bg-indigo-600 text-white text-center rounded-lg hover:bg-indigo-700 transition-colors disabled:bg-gray-400"
            >
              {purchasing ? 'Processing...' : `Enroll Now for $${course.price}`}
            </button>
          </div>
        )}
      </div>
    </StudentLayout>
  );
};

export default CourseDetail; 