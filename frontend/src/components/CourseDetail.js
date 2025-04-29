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

  useEffect(() => {
    if (id) {
      console.log('Course ID from params:', id); // Debug log
      fetchCourse();
    }
  }, [id]);

  const fetchCourse = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching course with ID:', id); // Debug log
      const response = await mockApiService.getCourse(id);
      console.log('API Response:', response); // Debug log
      
      if (response.success) {
        setCourse(response.data);
        // Initialize expanded sections
        const initialExpanded = {};
        response.data.sections.forEach(section => {
          initialExpanded[section.id] = false;
        });
        setExpandedSections(initialExpanded);
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading course details...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
              <strong className="font-bold">Error: </strong>
              <span className="block sm:inline">{error}</span>
            </div>
            <button
              onClick={fetchCourse}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Try Again
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  if (!course) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900">Course Not Found</h2>
            <p className="mt-2 text-gray-600">The course you're looking for doesn't exist.</p>
            <Link
              to="/courses"
              className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Browse Courses
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Course Header */}
          <div className="relative h-96">
            {course.thumbnail && (
              <img
                src={course.thumbnail}
                alt={course.title}
                className="w-full h-full object-cover"
              />
            )}
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="text-center text-white">
                <h1 className="text-4xl font-bold mb-4">{course.title}</h1>
                <p className="text-xl">{course.category}</p>
              </div>
            </div>
          </div>

          <div className="p-8">
            {/* Course Info and Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Course Content */}
              <div className="lg:col-span-2">
                <h2 className="text-2xl font-bold mb-6">Course Content</h2>
                <div className="space-y-4">
                  {course.sections && course.sections.map((section) => (
                    <div key={section.id} className="border rounded-lg overflow-hidden">
                      <button
                        onClick={() => toggleSection(section.id)}
                        className="w-full px-4 py-3 bg-gray-50 hover:bg-gray-100 flex justify-between items-center"
                      >
                        <div>
                          <h3 className="font-semibold text-gray-900">{section.title}</h3>
                          <p className="text-sm text-gray-500">{section.description}</p>
                        </div>
                        <svg
                          className={`w-5 h-5 transform transition-transform ${
                            expandedSections[section.id] ? 'rotate-180' : ''
                          }`}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      {expandedSections[section.id] && (
                        <div className="p-4 bg-white">
                          <ul className="space-y-2">
                            {section.videos && section.videos.map((video) => (
                              <li
                                key={video.id}
                                className="flex items-center p-2 hover:bg-gray-50 rounded cursor-pointer"
                                onClick={() => handleVideoSelect(video)}
                              >
                                <div className="flex-shrink-0 w-12 h-12 relative">
                                  <img
                                    src={video.thumbnail}
                                    alt={video.title}
                                    className="w-full h-full object-cover rounded"
                                  />
                                  <div className="absolute inset-0 flex items-center justify-center">
                                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                                      <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" />
                                    </svg>
                                  </div>
                                </div>
                                <div className="ml-4 flex-1">
                                  <h4 className="text-sm font-medium text-gray-900">{video.title}</h4>
                                  <p className="text-sm text-gray-500">{video.duration}</p>
                                </div>
                                {video.isPreview && (
                                  <span className="px-2 py-1 text-xs font-semibold text-blue-600 bg-blue-100 rounded-full">
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

              {/* Course Info Sidebar */}
              <div className="lg:col-span-1">
                <div className="bg-gray-50 rounded-lg p-6 sticky top-6">
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-3xl font-bold text-gray-900">${course.price}</span>
                    <span className="text-sm text-gray-500">{course.enrolled_students} students enrolled</span>
                  </div>

                  <button
                    onClick={handleEnroll}
                    disabled={enrolling}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
                  >
                    {enrolling ? 'Processing...' : 'Enroll Now'}
                  </button>

                  <div className="mt-6">
                    <h3 className="font-semibold text-gray-900 mb-3">What you'll learn</h3>
                    <ul className="space-y-2">
                      {course.learning_objectives && course.learning_objectives.map((objective, index) => (
                        <li key={index} className="flex items-start">
                          <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-gray-600">{objective}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-6">
                    <h3 className="font-semibold text-gray-900 mb-3">Course Details</h3>
                    <div className="space-y-3">
                      <div>
                        <span className="text-sm text-gray-500">Duration</span>
                        <p className="text-gray-900">{course.duration}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Level</span>
                        <p className="text-gray-900">{course.level}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Prerequisites</span>
                        <p className="text-gray-900">{course.prerequisites}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Video Player Modal */}
            {selectedVideo && (
              <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-4 max-w-4xl w-full mx-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold">{selectedVideo.title}</h3>
                    <button
                      onClick={() => setSelectedVideo(null)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  <div className="aspect-w-16 aspect-h-9">
                    <video
                      src={selectedVideo.videoUrl}
                      controls
                      className="w-full h-full rounded-lg"
                    >
                      Your browser does not support the video tag.
                    </video>
                  </div>
                  <p className="mt-4 text-gray-600">{selectedVideo.description}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CourseDetail; 