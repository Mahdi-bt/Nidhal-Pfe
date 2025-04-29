import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { mockApiService } from '../services/mockData';
import { useAuth } from '../contexts/AuthContext';
import Layout from '../components/layout/Layout';

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [enrolling, setEnrolling] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [expandedSections, setExpandedSections] = useState({});
  const [activeTab, setActiveTab] = useState('content'); // 'content', 'description', 'reviews'
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    if (id) {
      fetchCourse();
    }
    // Add fade-in animation on component mount
    setTimeout(() => setFadeIn(true), 100);
  }, [id]);

  const fetchCourse = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await mockApiService.getCourse(id);
      
      if (response.success) {
        setCourse(response.data);
        // Initialize expanded sections
        const initialExpanded = {};
        // Make sure sections exists, default to empty array if not
        const sections = response.data.sections || [];
        // Expand the first section by default
        if (sections.length > 0) {
          initialExpanded[sections[0].id] = true;
        }
        // Set the initial state for all sections
        sections.forEach(section => {
          if (!initialExpanded[section.id]) {
            initialExpanded[section.id] = false;
          }
        });
        setExpandedSections(initialExpanded);
        
        // Set the first preview video as selected if available
        const allVideos = sections.flatMap(section => section.videos || []);
        const previewVideo = allVideos.find(video => video.isPreview);
        if (previewVideo) {
          setSelectedVideo(previewVideo);
        }
      } else {
        setError(response.error || 'Course not found');
      }
    } catch (err) {
      console.error('Error fetching course:', err);
      setError('Failed to fetch course details');
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      setEnrolling(true);
      setError(null);
      
      // Use mock data service for enrollment
      const response = await mockApiService.enrollInCourse(user.id, parseInt(id));
      
      if (response.success) {
        navigate('/my-courses');
      } else {
        setError(response.error || 'Failed to enroll in course');
      }
    } catch (err) {
      console.error('Error enrolling in course:', err);
      setError('Failed to enroll in course');
    } finally {
      setEnrolling(false);
    }
  };

  const toggleSection = (sectionId) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const handleVideoSelect = (video) => {
    setSelectedVideo(video);
  };

  if (loading) {
    return (
      <Layout>
        <div className="h-screen flex flex-col justify-center items-center px-4">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-600"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <svg className="h-8 w-8 text-indigo-600 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>
          </div>
          <p className="mt-6 text-lg text-gray-600 font-medium">Loading amazing course content...</p>
          <p className="text-gray-500">This will just take a moment</p>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="max-w-3xl mx-auto px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <div className="bg-red-50 border-l-4 border-red-500 rounded-lg shadow-md p-8">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-red-800">Something went wrong</h3>
                <div className="mt-2 text-red-700">
                  <p>{error}</p>
                </div>
                <div className="mt-6 flex gap-4">
                  <button
                    onClick={fetchCourse}
                    className="px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
                  >
                    Try Again
                  </button>
                  <Link
                    to="/courses"
                    className="px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Back to Courses
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!course) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <div className="text-center">
            <svg className="h-16 w-16 text-gray-400 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 14h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 className="mt-4 text-2xl font-bold text-gray-900 tracking-tight">Course Not Found</h2>
            <p className="mt-2 text-lg text-gray-600">We couldn't find the course you're looking for.</p>
            <div className="mt-8">
              <Link
                to="/courses"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Browse All Courses
              </Link>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className={`transition-opacity duration-500 ${fadeIn ? 'opacity-100' : 'opacity-0'}`}>
        {/* Hero Banner */}
        <div className="relative">
          {/* Course Banner */}
          <div className="relative h-80 md:h-96 overflow-hidden">
            {course.thumbnail ? (
              <img
                src={course.thumbnail}
                alt={course.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-r from-indigo-600 to-blue-600"></div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
            
            {/* Course Title Overlay */}
            <div className="absolute bottom-0 left-0 w-full p-6 md:p-10">
              <div className="max-w-7xl mx-auto">
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <span className="px-3 py-1 bg-white/20 text-white text-sm font-medium rounded-full backdrop-blur-sm">
                    {course.category}
                  </span>
                  <span className="px-3 py-1 bg-white/20 text-white text-sm font-medium rounded-full backdrop-blur-sm">
                    {course.level}
                  </span>
                  <span className="px-3 py-1 bg-white/20 text-white text-sm font-medium rounded-full backdrop-blur-sm">
                    {course.duration}
                  </span>
                </div>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2 drop-shadow-sm">
                  {course.title}
                </h1>
                <p className="text-lg text-white/90 max-w-3xl drop-shadow-sm">
                  {course.short_description || course.description.substring(0, 150) + '...'}
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Main Content Area */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Tabs Navigation */}
          <div className="border-b border-gray-200 mb-8">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('content')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'content'
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Course Content
              </button>
              <button
                onClick={() => setActiveTab('description')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'description'
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Description
              </button>
              <button
                onClick={() => setActiveTab('reviews')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'reviews'
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Reviews
              </button>
            </nav>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            {/* Main Content Column */}
            <div className="lg:col-span-2">
              {/* Content Tab */}
              {activeTab === 'content' && (
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                  <div className="p-6 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-gray-900">Course Curriculum</h2>
                    <p className="mt-1 text-gray-500">
                      {course.sections?.length || 0} sections • {course.videos_count || 0} lessons • {course.duration} total
                    </p>
                  </div>
                  
                  <div className="divide-y divide-gray-100">
                    {course.sections && course.sections.map((section) => (
                      <div key={section.id} className="overflow-hidden">
                        <button
                          onClick={() => toggleSection(section.id)}
                          className="w-full px-6 py-4 flex justify-between items-center hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-start">
                            <div className="mr-4 pt-1">
                              {expandedSections[section.id] ? (
                                <svg className="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                              ) : (
                                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                              )}
                            </div>
                            <div className="text-left">
                              <h3 className="font-semibold text-gray-900">{section.title}</h3>
                              <p className="text-sm text-gray-500 mt-1">{section.description}</p>
                              <div className="mt-1 text-xs text-gray-500">
                                {section.videos?.length || 0} lessons • {section.duration || 'N/A'}
                              </div>
                            </div>
                          </div>
                        </button>
                        
                        {expandedSections[section.id] && (
                          <div className="bg-gray-50 px-6 py-3">
                            <ul className="divide-y divide-gray-200">
                              {section.videos && section.videos.map((video) => (
                                <li
                                  key={video.id}
                                  className="py-3 flex items-center hover:bg-gray-100 px-3 rounded-lg cursor-pointer transition-colors"
                                  onClick={() => handleVideoSelect(video)}
                                >
                                  <div className="flex-shrink-0 w-12 h-12 relative rounded-md overflow-hidden">
                                    {video.thumbnail ? (
                                      <img
                                        src={video.thumbnail}
                                        alt=""
                                        className="w-full h-full object-cover"
                                      />
                                    ) : (
                                      <div className="w-full h-full bg-indigo-100 flex items-center justify-center">
                                        <svg className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                      </div>
                                    )}
                                    <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
                                      <svg className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M8 5v14l11-7z" />
                                      </svg>
                                    </div>
                                  </div>
                                  <div className="ml-4 flex-1">
                                    <div className="flex items-center justify-between">
                                      <h4 className="text-sm font-medium text-gray-900 line-clamp-1">{video.title}</h4>
                                      <span className="text-xs text-gray-500">{video.duration}</span>
                                    </div>
                                    {video.description && (
                                      <p className="mt-1 text-xs text-gray-500 line-clamp-1">{video.description}</p>
                                    )}
                                  </div>
                                  {video.isPreview && (
                                    <span className="ml-3 px-2 py-1 text-xs font-medium text-indigo-600 bg-indigo-100 rounded-full">
                                      Preview
                                    </span>
                                  )}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Description Tab */}
              {activeTab === 'description' && (
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                  <div className="p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">About This Course</h2>
                    <div className="prose prose-indigo max-w-none">
                      <p className="text-gray-700">{course.description}</p>
                      
                      {course.learning_objectives && course.learning_objectives.length > 0 && (
                        <>
                          <h3 className="text-lg font-semibold text-gray-900 mt-8 mb-4">What You'll Learn</h3>
                          <ul className="space-y-2">
                            {course.learning_objectives.map((objective, index) => (
                              <li key={index} className="flex items-start">
                                <svg className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <span className="text-gray-700">{objective}</span>
                              </li>
                            ))}
                          </ul>
                        </>
                      )}
                      
                      {course.prerequisites && (
                        <>
                          <h3 className="text-lg font-semibold text-gray-900 mt-8 mb-4">Prerequisites</h3>
                          <p className="text-gray-700">{course.prerequisites}</p>
                        </>
                      )}
                      
                      {course.target_audience && (
                        <>
                          <h3 className="text-lg font-semibold text-gray-900 mt-8 mb-4">Who This Course is For</h3>
                          <p className="text-gray-700">{course.target_audience}</p>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )}
              
              {/* Reviews Tab */}
              {activeTab === 'reviews' && (
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                  <div className="p-6 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-bold text-gray-900">Student Reviews</h2>
                      <div className="flex items-center">
                        <div className="flex items-center">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <svg
                              key={star}
                              className={`h-5 w-5 ${
                                star <= (course.rating || 4.5) 
                                  ? 'text-yellow-400' 
                                  : 'text-gray-300'
                              }`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                        <span className="ml-2 text-lg font-bold text-gray-900">{course.rating || 4.5}</span>
                        <span className="ml-2 text-sm text-gray-600">({course.reviews_count || 0} reviews)</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="divide-y divide-gray-100">
                    {course.reviews ? (
                      course.reviews.map((review) => (
                        <div key={review.id} className="p-6">
                          <div className="flex items-start">
                            <div className="flex-shrink-0">
                              <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                                <span className="text-indigo-800 font-medium">
                                  {review.user_name ? review.user_name.charAt(0).toUpperCase() : '?'}
                                </span>
                              </div>
                            </div>
                            <div className="ml-4 flex-1">
                              <div className="flex items-center justify-between">
                                <h4 className="text-sm font-medium text-gray-900">{review.user_name || 'Anonymous'}</h4>
                                <span className="text-sm text-gray-500">{review.date || '2 weeks ago'}</span>
                              </div>
                              <div className="mt-1 flex items-center">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <svg
                                    key={star}
                                    className={`h-4 w-4 ${
                                      star <= review.rating 
                                        ? 'text-yellow-400' 
                                        : 'text-gray-300'
                                    }`}
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                  </svg>
                                ))}
                              </div>
                              <p className="mt-2 text-sm text-gray-700">{review.comment}</p>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-8 text-center">
                        <svg className="h-12 w-12 text-gray-300 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                        </svg>
                        <h3 className="mt-2 text-sm font-medium text-gray-900">No reviews yet</h3>
                        <p className="mt-1 text-sm text-gray-500">
                          Be the first to review this course after enrolling!
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar Column */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm overflow-hidden sticky top-8">
                {/* Preview Video Card */}
                {course.preview_video && (
                  <div className="relative aspect-video bg-gray-900">
                    {course.preview_image ? (
                      <img 
                        src={course.preview_image} 
                        alt="Course preview" 
                        className="w-full h-full object-cover opacity-80"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-indigo-800 to-indigo-900"></div>
                    )}
                    <button 
                      onClick={() => handleVideoSelect(course.preview_video)}
                      className="absolute inset-0 flex items-center justify-center"
                    >
                      <div className="h-16 w-16 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center p-1">
                        <div className="h-full w-full rounded-full bg-indigo-600 flex items-center justify-center">
                          <svg className="h-8 w-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </div>
                      </div>
                      <span className="sr-only">Play preview</span>
                    </button>
                    <div className="absolute bottom-3 left-3 bg-black/50 backdrop-blur-sm px-2 py-1 rounded text-sm text-white font-medium">
                      Preview this course
                    </div>
                  </div>
                )}
                
                {/* Price Card */}
                <div className="p-6">
                  <div className="flex items-end gap-2 mb-6">
                    <span className="text-3xl font-bold text-gray-900">${course.price}</span>
                    {course.original_price && (
                      <span className="text-lg text-gray-500 line-through">${course.original_price}</span>
                    )}
                    {course.discount_percentage && (
                      <span className="text-sm font-medium text-green-600 ml-2">{course.discount_percentage}% off</span>
                    )}
                  </div>
                  
                  <button
                    onClick={handleEnroll}
                    disabled={enrolling}
                    className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white text-center rounded-lg font-medium transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    {enrolling ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </span>
                    ) : (
                      'Enroll Now'
                    )}
                  </button>
                  
                  <p className="text-xs text-gray-500 mt-2 text-center">
                    30-Day Money-Back Guarantee
                  </p>
                  
                  {/* Course Includes */}
                  <div className="mt-6">
                    <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-2">
                      This Course Includes
                    </h3>
                    <ul className="space-y-3">
                      <li className="flex items-center text-sm text-gray-700">
                        <svg className="h-5 w-5 text-indigo-600 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        {course.videos_count || (course.sections?.reduce((total, section) => total + (section.videos?.length || 0), 0) || 0)} on-demand videos
                      </li>
                      <li className="flex items-center text-sm text-gray-700">
                        <svg className="h-5 w-5 text-indigo-600 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        {course.resources_count || '10+'} downloadable resources
                      </li>
                      <li className="flex items-center text-sm text-gray-700">
                        <svg className="h-5 w-5 text-indigo-600 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Full lifetime access
                      </li>
                      <li className="flex items-center text-sm text-gray-700">
                        <svg className="h-5 w-5 text-indigo-600 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                        </svg>
                        Certificate of completion
                      </li>
                    </ul>
                  </div>
                  
                  {/* CTA Cards */}
                  <div className="mt-6 grid gap-4">
                    <button className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition-colors">
                      <svg className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                      Add to Wishlist
                    </button>
                    <button className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition-colors">
                      <svg className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                      </svg>
                      Share
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Video Player Modal */}
      {selectedVideo && (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            {/* Background overlay */}
            <div className="fixed inset-0 bg-gray-900 bg-opacity-90 transition-opacity" onClick={() => setSelectedVideo(null)}></div>
            
            {/* Modal panel */}
            <div className="inline-block align-bottom bg-white rounded-lg overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-5xl sm:w-full">
              <div className="relative">
                {/* Close button */}
                <button
                  type="button"
                  className="absolute top-3 right-3 z-10 bg-black/50 backdrop-blur-sm rounded-full p-2 text-white hover:bg-black/70 transition-colors"
                  onClick={() => setSelectedVideo(null)}
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <span className="sr-only">Close</span>
                </button>
                
                {/* Video player */}
                <div className="aspect-w-16 aspect-h-9 bg-black">
                  <video
                    src={selectedVideo.videoUrl}
                    controls
                    autoPlay
                    className="w-full h-full object-contain"
                  >
                    Your browser does not support the video tag.
                  </video>
                </div>
              </div>
              
              {/* Video info */}
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900">{selectedVideo.title}</h3>
                {selectedVideo.description && (
                  <p className="mt-2 text-gray-600">{selectedVideo.description}</p>
                )}
                {!selectedVideo.isPreview && !isAuthenticated && (
                  <div className="mt-4 bg-indigo-50 p-4 rounded-lg">
                    <p className="text-sm text-indigo-700">
                      <span className="font-medium">Premium content: </span>
                      Enroll in this course to access all videos and resources.
                    </p>
                    <button
                      onClick={handleEnroll}
                      className="mt-2 py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded transition-colors"
                    >
                      Enroll Now
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default CourseDetail; 