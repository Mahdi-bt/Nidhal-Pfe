import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import { mockApiService } from '../../services/mockData';

const CourseManagement = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingCourse, setEditingCourse] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('basicInfo');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    duration: '',
    level: 'Beginner',
    category: '',
    thumbnail: '',
    max_students: 30,
    start_date: '',
    end_date: '',
    schedule: '',
    prerequisites: '',
    learning_objectives: '',
    enrolled_students: 0,
    is_active: true,
    sections: []
  });

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
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

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Add a new empty section
  const addSection = () => {
    setFormData(prev => ({
      ...prev,
      sections: [
        ...prev.sections,
        {
          id: Date.now(), // Temporary ID
          title: '',
          description: '',
          order: prev.sections.length + 1,
          videos: []
        }
      ]
    }));
  };

  // Update a section
  const updateSection = (index, field, value) => {
    setFormData(prev => {
      const updatedSections = [...prev.sections];
      updatedSections[index] = {
        ...updatedSections[index],
        [field]: value
      };
      return { ...prev, sections: updatedSections };
    });
  };

  // Remove a section
  const removeSection = (index) => {
    setFormData(prev => {
      const updatedSections = prev.sections.filter((_, i) => i !== index);
      // Reorder remaining sections
      updatedSections.forEach((section, i) => {
        section.order = i + 1;
      });
      return { ...prev, sections: updatedSections };
    });
  };

  // Add a new video to a section
  const addVideo = (sectionIndex) => {
    setFormData(prev => {
      const updatedSections = [...prev.sections];
      updatedSections[sectionIndex].videos.push({
        id: Date.now(), // Temporary ID
        title: '',
        description: '',
        duration: '',
        videoUrl: '',
        thumbnail: '',
        isPreview: false
      });
      return { ...prev, sections: updatedSections };
    });
  };

  // Update a video
  const updateVideo = (sectionIndex, videoIndex, field, value) => {
    setFormData(prev => {
      const updatedSections = [...prev.sections];
      const updatedVideos = [...updatedSections[sectionIndex].videos];
      updatedVideos[videoIndex] = {
        ...updatedVideos[videoIndex],
        [field]: value === 'true' ? true : value === 'false' ? false : value
      };
      updatedSections[sectionIndex].videos = updatedVideos;
      return { ...prev, sections: updatedSections };
    });
  };

  // Remove a video
  const removeVideo = (sectionIndex, videoIndex) => {
    setFormData(prev => {
      const updatedSections = [...prev.sections];
      updatedSections[sectionIndex].videos = updatedSections[sectionIndex].videos.filter((_, i) => i !== videoIndex);
      return { ...prev, sections: updatedSections };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Format the learning objectives as an array if it's a string
    const formattedData = { ...formData };
    
    if (typeof formattedData.learning_objectives === 'string' && formattedData.learning_objectives.trim()) {
      formattedData.learning_objectives = formattedData.learning_objectives
        .split('\n')
        .map(item => item.trim())
        .filter(item => item);
    }
    
    // Ensure price and max_students are numbers
    formattedData.price = parseFloat(formattedData.price);
    formattedData.max_students = parseInt(formattedData.max_students, 10);
    formattedData.enrolled_students = formattedData.enrolled_students || 0;
    
    try {
      let response;
      if (editingCourse) {
        response = await mockApiService.updateCourse(editingCourse.id, formattedData);
      } else {
        response = await mockApiService.createCourse(formattedData);
      }

      if (response.success) {
        fetchCourses();
        resetForm();
        closeModal();
      } else {
        setError(response.error);
      }
    } catch (err) {
      setError('Failed to save course');
    }
  };

  const handleEdit = (course) => {
    // Format learning objectives array back to string for textarea
    const formattedCourse = { ...course };
    if (Array.isArray(formattedCourse.learning_objectives)) {
      formattedCourse.learning_objectives = formattedCourse.learning_objectives.join('\n');
    }
    
    setEditingCourse(course);
    setFormData(formattedCourse);
    setActiveTab('basicInfo');
    openModal();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        const response = await mockApiService.deleteCourse(id);
        if (response.success) {
          fetchCourses();
        } else {
          setError(response.error);
        }
      } catch (err) {
        setError('Failed to delete course');
      }
    }
  };

  const resetForm = () => {
    setEditingCourse(null);
    setActiveTab('basicInfo');
    setFormData({
      title: '',
      description: '',
      price: '',
      duration: '',
      level: 'Beginner',
      category: '',
      thumbnail: '',
      max_students: 30,
      start_date: '',
      end_date: '',
      schedule: '',
      prerequisites: '',
      learning_objectives: '',
      enrolled_students: 0,
      is_active: true,
      sections: []
    });
  };

  const openModal = () => {
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setIsModalOpen(false);
    document.body.style.overflow = 'auto';
  };

  const addNewCourse = () => {
    resetForm();
    openModal();
  };

  if (loading) return (
    <AdminLayout>
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    </AdminLayout>
  );

  if (error) return (
    <AdminLayout>
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg my-6 mx-auto max-w-6xl">
        <p className="font-medium">Error</p>
        <p>{error}</p>
      </div>
    </AdminLayout>
  );

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Course Management</h1>
          <button 
            onClick={addNewCourse}
            className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Add New Course
          </button>
        </div>

        {/* Enhanced Course Modal */}
        {isModalOpen && (
          <>
            <div 
              className="fixed inset-0 bg-gray-900 bg-opacity-50 backdrop-blur-sm z-40 transition-opacity animate-fadeIn"
              onClick={closeModal}
            ></div>
            <div className="fixed inset-0 z-50 overflow-y-auto">
              <div className="flex min-h-full items-center justify-center p-4">
                <div 
                  className="relative transform overflow-hidden rounded-2xl bg-white shadow-2xl transition-all w-full max-w-4xl animate-modalSlideIn"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>
                  <div className="p-8">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-2xl font-semibold text-gray-800">
                        {editingCourse ? 'Edit Course' : 'Create New Course'}
                      </h2>
                      <button 
                        onClick={closeModal}
                        className="text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-full hover:bg-gray-100"
                        aria-label="Close modal"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>

                    {/* Tabs */}
                    <div className="border-b border-gray-200 mb-6">
                      <nav className="-mb-px flex space-x-8">
                        <button
                          className={`pb-4 px-1 border-b-2 font-medium text-sm ${
                            activeTab === 'basicInfo'
                              ? 'border-blue-500 text-blue-600'
                              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                          } transition-colors duration-200`}
                          onClick={() => setActiveTab('basicInfo')}
                        >
                          Basic Information
                        </button>
                        <button
                          className={`pb-4 px-1 border-b-2 font-medium text-sm ${
                            activeTab === 'content'
                              ? 'border-blue-500 text-blue-600'
                              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                          } transition-colors duration-200`}
                          onClick={() => setActiveTab('content')}
                        >
                          Content & Sections
                        </button>
                        <button
                          className={`pb-4 px-1 border-b-2 font-medium text-sm ${
                            activeTab === 'settings'
                              ? 'border-blue-500 text-blue-600'
                              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                          } transition-colors duration-200`}
                          onClick={() => setActiveTab('settings')}
                        >
                          Advanced Settings
                        </button>
                      </nav>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                      {/* Basic Information Tab */}
                      {activeTab === 'basicInfo' && (
                        <>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <div className="space-y-2">
                              <label className="block text-sm font-medium text-gray-700">Title</label>
                              <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm transition-colors duration-200"
                                placeholder="Course title"
                                required
                              />
                            </div>

                            <div className="space-y-2">
                              <label className="block text-sm font-medium text-gray-700">Price ($)</label>
                              <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                  <span className="text-gray-500 sm:text-sm">$</span>
                                </div>
                                <input
                                  type="number"
                                  name="price"
                                  value={formData.price}
                                  onChange={handleInputChange}
                                  className="w-full pl-7 rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm transition-colors duration-200"
                                  placeholder="99.99"
                                  required
                                />
                              </div>
                            </div>

                            <div className="space-y-2">
                              <label className="block text-sm font-medium text-gray-700">Duration</label>
                              <input
                                type="text"
                                name="duration"
                                value={formData.duration}
                                onChange={handleInputChange}
                                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm transition-colors duration-200"
                                placeholder="e.g. 8 weeks"
                                required
                              />
                            </div>

                            <div className="space-y-2">
                              <label className="block text-sm font-medium text-gray-700">Level</label>
                              <select
                                name="level"
                                value={formData.level}
                                onChange={handleInputChange}
                                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm transition-colors duration-200"
                              >
                                <option value="Beginner">Beginner</option>
                                <option value="Intermediate">Intermediate</option>
                                <option value="Advanced">Advanced</option>
                              </select>
                            </div>

                            <div className="space-y-2">
                              <label className="block text-sm font-medium text-gray-700">Category</label>
                              <input
                                type="text"
                                name="category"
                                value={formData.category}
                                onChange={handleInputChange}
                                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm transition-colors duration-200"
                                placeholder="e.g. Programming"
                                required
                              />
                            </div>

                            <div className="space-y-2">
                              <label className="block text-sm font-medium text-gray-700">Max Students</label>
                              <input
                                type="number"
                                name="max_students"
                                value={formData.max_students}
                                onChange={handleInputChange}
                                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm transition-colors duration-200"
                                placeholder="30"
                                required
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                            <div className="space-y-2">
                              <label className="block text-sm font-medium text-gray-700">Description</label>
                              <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                rows="4"
                                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm transition-colors duration-200"
                                placeholder="Detailed course description"
                                required
                              ></textarea>
                            </div>

                            <div className="space-y-6">
                              <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Prerequisites</label>
                                <textarea
                                  name="prerequisites"
                                  value={formData.prerequisites}
                                  onChange={handleInputChange}
                                  rows="2"
                                  className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm transition-colors duration-200"
                                  placeholder="Required skills or knowledge"
                                ></textarea>
                              </div>

                              <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">
                                  Learning Objectives
                                  <span className="ml-1 text-xs text-gray-500">(One per line)</span>
                                </label>
                                <textarea
                                  name="learning_objectives"
                                  value={formData.learning_objectives}
                                  onChange={handleInputChange}
                                  rows="3"
                                  className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm transition-colors duration-200"
                                  placeholder="What students will learn (one objective per line)"
                                ></textarea>
                              </div>
                            </div>
                          </div>
                        </>
                      )}

                      {/* Content & Sections Tab */}
                      {activeTab === 'content' && (
                        <div className="space-y-6">
                          <div className="flex justify-between items-center">
                            <h3 className="text-lg font-medium text-gray-900">Course Sections</h3>
                            <button
                              type="button"
                              onClick={addSection}
                              className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                              </svg>
                              Add Section
                            </button>
                          </div>

                          {formData.sections.length === 0 ? (
                            <div className="text-center py-12 bg-gray-50 rounded-lg">
                              <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                              </svg>
                              <h3 className="mt-2 text-sm font-medium text-gray-900">No sections</h3>
                              <p className="mt-1 text-sm text-gray-500">Get started by creating a new section.</p>
                            </div>
                          ) : (
                            <div className="space-y-6">
                              {formData.sections.map((section, sectionIndex) => (
                                <div key={section.id || sectionIndex} className="border border-gray-200 rounded-lg overflow-hidden">
                                  <div className="bg-gray-50 px-4 py-3 flex items-center justify-between">
                                    <h4 className="text-sm font-medium text-gray-700">
                                      Section {section.order}: {section.title || 'Untitled Section'}
                                    </h4>
                                    <div className="flex items-center space-x-2">
                                      <button
                                        type="button"
                                        onClick={() => addVideo(sectionIndex)}
                                        className="inline-flex items-center px-2 py-1 text-xs font-medium rounded text-blue-700 bg-blue-50 hover:bg-blue-100"
                                      >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                          <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                                        </svg>
                                        Add Video
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => removeSection(sectionIndex)}
                                        className="text-red-600 hover:text-red-900"
                                      >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                        </svg>
                                      </button>
                                    </div>
                                  </div>
                                  <div className="p-4 space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                      <div>
                                        <label className="block text-sm font-medium text-gray-700">Section Title</label>
                                        <input
                                          type="text"
                                          value={section.title}
                                          onChange={(e) => updateSection(sectionIndex, 'title', e.target.value)}
                                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                          placeholder="e.g. Introduction to HTML"
                                        />
                                      </div>
                                      <div>
                                        <label className="block text-sm font-medium text-gray-700">Section Description</label>
                                        <input
                                          type="text"
                                          value={section.description}
                                          onChange={(e) => updateSection(sectionIndex, 'description', e.target.value)}
                                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                          placeholder="Brief description of this section"
                                        />
                                      </div>
                                    </div>

                                    {/* Videos */}
                                    <div className="mt-4">
                                      <h5 className="text-sm font-medium text-gray-700 mb-3">Videos</h5>
                                      {section.videos.length === 0 ? (
                                        <p className="text-sm text-gray-500 italic">No videos in this section yet.</p>
                                      ) : (
                                        <div className="space-y-4">
                                          {section.videos.map((video, videoIndex) => (
                                            <div key={video.id || videoIndex} className="border border-gray-200 rounded-md p-3 bg-gray-50">
                                              <div className="flex justify-between items-start mb-3">
                                                <h6 className="text-sm font-medium text-gray-700">
                                                  Video {videoIndex + 1}: {video.title || 'Untitled Video'}
                                                </h6>
                                                <button
                                                  type="button"
                                                  onClick={() => removeVideo(sectionIndex, videoIndex)}
                                                  className="text-red-600 hover:text-red-900"
                                                >
                                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                                  </svg>
                                                </button>
                                              </div>
                                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                <div>
                                                  <label className="block text-xs font-medium text-gray-700">Title</label>
                                                  <input
                                                    type="text"
                                                    value={video.title}
                                                    onChange={(e) => updateVideo(sectionIndex, videoIndex, 'title', e.target.value)}
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-xs"
                                                    placeholder="Video title"
                                                  />
                                                </div>
                                                <div>
                                                  <label className="block text-xs font-medium text-gray-700">Duration</label>
                                                  <input
                                                    type="text"
                                                    value={video.duration}
                                                    onChange={(e) => updateVideo(sectionIndex, videoIndex, 'duration', e.target.value)}
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-xs"
                                                    placeholder="e.g. 10:15"
                                                  />
                                                </div>
                                                <div>
                                                  <label className="block text-xs font-medium text-gray-700">Video URL</label>
                                                  <input
                                                    type="text"
                                                    value={video.videoUrl}
                                                    onChange={(e) => updateVideo(sectionIndex, videoIndex, 'videoUrl', e.target.value)}
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-xs"
                                                    placeholder="https://example.com/video.mp4"
                                                  />
                                                </div>
                                                <div>
                                                  <label className="block text-xs font-medium text-gray-700">Thumbnail URL</label>
                                                  <input
                                                    type="text"
                                                    value={video.thumbnail}
                                                    onChange={(e) => updateVideo(sectionIndex, videoIndex, 'thumbnail', e.target.value)}
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-xs"
                                                    placeholder="https://example.com/thumbnail.jpg"
                                                  />
                                                </div>
                                                <div className="md:col-span-2">
                                                  <label className="block text-xs font-medium text-gray-700">Description</label>
                                                  <textarea
                                                    value={video.description}
                                                    onChange={(e) => updateVideo(sectionIndex, videoIndex, 'description', e.target.value)}
                                                    rows="2"
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-xs"
                                                    placeholder="Brief description of this video"
                                                  ></textarea>
                                                </div>
                                                <div>
                                                  <label className="inline-flex items-center mt-2">
                                                    <input
                                                      type="checkbox"
                                                      checked={video.isPreview}
                                                      onChange={(e) => updateVideo(sectionIndex, videoIndex, 'isPreview', e.target.checked.toString())}
                                                      className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                                    />
                                                    <span className="ml-2 text-xs text-gray-700">Available as preview</span>
                                                  </label>
                                                </div>
                                              </div>
                                            </div>
                                          ))}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Advanced Settings Tab */}
                      {activeTab === 'settings' && (
                        <div className="space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <div className="space-y-2">
                              <label className="block text-sm font-medium text-gray-700">Start Date</label>
                              <input
                                type="date"
                                name="start_date"
                                value={formData.start_date}
                                onChange={handleInputChange}
                                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm transition-colors duration-200"
                              />
                            </div>

                            <div className="space-y-2">
                              <label className="block text-sm font-medium text-gray-700">End Date</label>
                              <input
                                type="date"
                                name="end_date"
                                value={formData.end_date}
                                onChange={handleInputChange}
                                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm transition-colors duration-200"
                              />
                            </div>

                            <div className="space-y-2">
                              <label className="block text-sm font-medium text-gray-700">Schedule</label>
                              <input
                                type="text"
                                name="schedule"
                                value={formData.schedule}
                                onChange={handleInputChange}
                                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm transition-colors duration-200"
                                placeholder="e.g. Mon, Wed, Fri 6:00 PM - 8:00 PM"
                              />
                            </div>

                            <div className="space-y-2 lg:col-span-3">
                              <label className="block text-sm font-medium text-gray-700">Thumbnail URL</label>
                              <input
                                type="text"
                                name="thumbnail"
                                value={formData.thumbnail}
                                onChange={handleInputChange}
                                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm transition-colors duration-200"
                                placeholder="https://example.com/image.jpg"
                              />
                              {formData.thumbnail && (
                                <div className="mt-2 relative h-20 w-full sm:w-40 bg-gray-100 rounded overflow-hidden">
                                  <img 
                                    src={formData.thumbnail} 
                                    alt="Thumbnail preview" 
                                    className="h-full w-full object-cover"
                                    onError={(e) => {
                                      e.target.onerror = null;
                                      e.target.src = 'https://via.placeholder.com/400x200?text=Invalid+URL';
                                    }}
                                  />
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="pt-2">
                            <label className="inline-flex items-center">
                              <input
                                type="checkbox"
                                name="is_active"
                                checked={formData.is_active}
                                onChange={handleInputChange}
                                className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-colors duration-200"
                              />
                              <span className="ml-2 text-sm text-gray-700">Course is active and visible to students</span>
                            </label>
                          </div>
                        </div>
                      )}

                      <div className="pt-6 flex justify-end space-x-3 border-t">
                        <button
                          type="button"
                          onClick={closeModal}
                          className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-sm transition-all duration-200 font-medium"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-sm transition-all duration-200 font-medium"
                        >
                          {editingCourse ? 'Update Course' : 'Create Course'}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        <div className="mt-8">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Course List</h2>
            <p className="text-gray-500 text-sm">{courses.length} courses available</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div key={course.id} className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 transition-all duration-200 hover:shadow-lg">
                {course.thumbnail && (
                  <div className="h-48 w-full bg-gray-200 overflow-hidden">
                    <img 
                      src={course.thumbnail} 
                      alt={course.title} 
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://via.placeholder.com/400x200?text=No+Image';
                      }}
                    />
                  </div>
                )}
                
                <div className="p-5">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 truncate">{course.title}</h3>
                    <span className={`ml-2 px-2 py-1 text-xs font-medium rounded-full whitespace-nowrap ${
                      course.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {course.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-md">{course.level}</span>
                    <span className="bg-purple-50 text-purple-700 text-xs px-2 py-1 rounded-md">{course.category}</span>
                    <span className="bg-gray-50 text-gray-700 text-xs px-2 py-1 rounded-md">{course.duration}</span>
                    {course.start_date && (
                      <span className="bg-amber-50 text-amber-700 text-xs px-2 py-1 rounded-md">
                        Starts: {new Date(course.start_date).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                  
                  <p className="text-gray-600 text-sm line-clamp-2 mb-4">{course.description}</p>
                  
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-lg font-semibold text-gray-800">${course.price}</span>
                      {course.enrolled_students > 0 && (
                        <span className="ml-2 text-xs text-gray-500">
                          {course.enrolled_students}/{course.max_students} enrolled
                        </span>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(course)}
                        className="inline-flex items-center px-3 py-1 border border-blue-300 rounded text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500 transition-colors duration-200"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                        </svg>
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(course.id)}
                        className="inline-flex items-center px-3 py-1 border border-red-300 rounded text-sm font-medium text-red-700 bg-red-50 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-red-500 transition-colors duration-200"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {courses.length === 0 && (
            <div className="bg-gray-50 rounded-lg p-8 text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-1">No courses found</h3>
              <p className="text-gray-500">Get started by creating your first course</p>
              <button 
                onClick={addNewCourse}
                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Create Course
              </button>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

// Add CSS animations in the global stylesheet
// You can add these to your global CSS file
const styleElement = document.createElement('style');
styleElement.textContent = `
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes modalSlideIn {
  from { 
    opacity: 0;
    transform: translateY(-10px); 
  }
  to { 
    opacity: 1;
    transform: translateY(0); 
  }
}

.animate-fadeIn {
  animation: fadeIn 0.3s ease-out forwards;
}

.animate-modalSlideIn {
  animation: modalSlideIn 0.3s ease-out forwards;
}
`;
document.head.appendChild(styleElement);

export default CourseManagement; 