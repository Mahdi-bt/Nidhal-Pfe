import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/Layout/AdminLayout';
import { getAllCourses, Course, deleteCourse, createCourse, updateCourse, Section, Video } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/sonner';
import { Link } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react';

interface VideoFormData {
  id?: string;
  name: string;
  file?: File;
  duration: number;
  filePath?: string;
}

interface SectionFormData {
  id?: string;
  name: string;
  videos: VideoFormData[];
}

interface CourseFormData {
  name: string;
  description: string;
  price: number;
  level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  category: string;
  duration: number;
  thumbnail?: File;
  enrolledStudents: number;
  sections: SectionFormData[];
}

const initialVideoData: VideoFormData = {
  name: '',
  file: undefined,
  duration: 0,
};

const initialSectionData: SectionFormData = {
  name: '',
  videos: [initialVideoData],
};

const initialFormData: CourseFormData = {
  name: '',
  description: '',
  price: 0,
  level: 'BEGINNER',
  category: '',
  duration: 0,
  thumbnail: undefined,
  enrolledStudents: 0,
  sections: [
    {
      name: '',
      videos: [
        {
          name: '',
          file: undefined,
          duration: 0,
        },
      ],
    },
  ],
};

const getFileUrl = (path: string) => {
  if (!path) return '/placeholder-image.jpg';
  return `http://localhost:3000/${path}`;
};

const AdminCourses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [currentCourse, setCurrentCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentCourseId, setCurrentCourseId] = useState<string | null>(null);
  const [formData, setFormData] = useState<CourseFormData>(initialFormData);
  const [formLoading, setFormLoading] = useState(false);
  const [expandedSections, setExpandedSections] = useState<number[]>([]);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const data = await getAllCourses();
      setCourses(data);
    } catch (error) {
      console.error('Error fetching courses:', error);
      toast.error('Failed to load courses');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (course?: Course) => {
    if (course) {
      setIsEditing(true);
      setCurrentCourseId(course.id);
      setCurrentCourse(course);
      setFormData({
        name: course.name,
        description: course.description,
        price: course.price,
        level: course.level,
        category: course.category,
        duration: course.duration,
        thumbnail: undefined,
        enrolledStudents: course.enrolledStudents,
        sections: course.sections.map(section => ({
          id: section.id,
          name: section.name,
          videos: section.videos.map(video => ({
            id: video.id,
            name: video.name,
            file: undefined,
            duration: video.duration,
            filePath: video.filePath
          })),
        })),
      });
      setExpandedSections(course.sections.map((_, index) => index));
    } else {
      setIsEditing(false);
      setCurrentCourseId(null);
      setCurrentCourse(null);
      setFormData(initialFormData);
      setExpandedSections([0]);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormData(initialFormData);
    setIsEditing(false);
    setCurrentCourseId(null);
    setCurrentCourse(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'duration' ? Number(value) : value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);

    try {
      const formDataToSend = new FormData();
      
      // Add course data as JSON string
      const courseData = {
        name: formData.name,
        description: formData.description,
        price: formData.price,
        level: formData.level,
        category: formData.category,
        duration: formData.duration,
        sections: formData.sections.map(section => ({
          id: section.id,
          name: section.name,
          videos: section.videos.map(video => ({
            id: video.id,
            name: video.name,
            duration: video.duration,
            filePath: video.filePath
          })),
        })),
      };
      formDataToSend.append('course', JSON.stringify(courseData));

      // Add thumbnail file if exists
      if (formData.thumbnail instanceof File) {
        formDataToSend.append('thumbnail', formData.thumbnail);
      }

      // Add video files
      formData.sections.forEach((section, sectionIndex) => {
        section.videos.forEach((video, videoIndex) => {
          if (video.file instanceof File) {
            formDataToSend.append(`videos[${sectionIndex}][${videoIndex}]`, video.file);
          }
        });
      });

      if (isEditing && currentCourseId) {
        await updateCourse(currentCourseId, formDataToSend);
        toast.success('Course updated successfully');
      } else {
        await createCourse(formDataToSend);
        toast.success('Course created successfully');
      }
      handleCloseModal();
      fetchCourses();
    } catch (error) {
      console.error('Error saving course:', error);
      toast.error(isEditing ? 'Failed to update course' : 'Failed to create course');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteCourse = async (courseId: string) => {
    if (!window.confirm('Are you sure you want to delete this course?')) {
      return;
    }

    try {
      await deleteCourse(courseId);
      setCourses(courses.filter(course => course.id !== courseId));
      toast.success('Course deleted successfully');
    } catch (error) {
      console.error('Error deleting course:', error);
      toast.error('Failed to delete course');
    }
  };

  const handleAddSection = () => {
    setFormData(prev => ({
      ...prev,
      sections: [...prev.sections, { ...initialSectionData }],
    }));
    setExpandedSections(prev => [...prev, prev.length]);
  };

  const handleRemoveSection = (index: number) => {
    setFormData(prev => ({
      ...prev,
      sections: prev.sections.filter((_, i) => i !== index),
    }));
    setExpandedSections(prev => prev.filter(i => i !== index));
  };

  const handleAddVideo = (sectionIndex: number) => {
    setFormData(prev => ({
      ...prev,
      sections: prev.sections.map((section, index) => 
        index === sectionIndex
          ? { 
              ...section, 
              videos: [...section.videos, { 
                name: '',
                file: undefined,
                duration: 0,
                filePath: undefined
              }] 
            }
          : section
      ),
    }));
  };

  const handleRemoveVideo = (sectionIndex: number, videoIndex: number) => {
    setFormData(prev => ({
      ...prev,
      sections: prev.sections.map((section, index) => 
        index === sectionIndex
          ? { ...section, videos: section.videos.filter((_, i) => i !== videoIndex) }
          : section
      ),
    }));
  };

  const handleSectionChange = (index: number, field: keyof SectionFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      sections: prev.sections.map((section, i) => 
        i === index ? { ...section, [field]: value } : section
      ),
    }));
  };

  const handleVideoChange = (
    sectionIndex: number,
    videoIndex: number,
    field: keyof VideoFormData,
    value: string | number | File
  ) => {
    setFormData(prev => ({
      ...prev,
      sections: prev.sections.map((section, i) => 
        i === sectionIndex
          ? {
              ...section,
              videos: section.videos.map((video, j) => 
                j === videoIndex ? { ...video, [field]: value } : video
              ),
            }
          : section
      ),
    }));
  };

  const toggleSection = (index: number) => {
    setExpandedSections(prev =>
      prev.includes(index)
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  // Extract unique categories and levels from courses
  const categories = [...new Set(courses.map(course => course.category))];
  const levels = [...new Set(courses.map(course => course.level))];
  
  // Filter courses based on search term, category, and level
  const filteredCourses = courses.filter(course => {
    const matchesSearch = 
      course.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      course.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === '' || course.category === selectedCategory;
    const matchesLevel = selectedLevel === '' || course.level === selectedLevel;
    
    return matchesSearch && matchesCategory && matchesLevel;
  });

  return (
    <AdminLayout title="Course Management">
      <div className="mb-6 flex flex-col md:flex-row justify-between md:items-center gap-4">
        <Button className="w-full md:w-auto" onClick={() => handleOpenModal()}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Add New Course
        </Button>
        
        <div className="flex flex-col md:flex-row gap-2">
          <div className="relative">
            <input
              type="text"
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-9"
            />
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
          </div>
          
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="input-field"
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          
          <select
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
            className="input-field"
          >
            <option value="">All Levels</option>
            {levels.map((level) => (
              <option key={level} value={level}>{level}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Course Form Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Edit Course' : 'Add New Course'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Course Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Price ($)</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  min="0"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="level">Level</Label>
                <Select
                  value={formData.level}
                  onValueChange={(value) => handleSelectChange('level', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BEGINNER">Beginner</SelectItem>
                    <SelectItem value="INTERMEDIATE">Intermediate</SelectItem>
                    <SelectItem value="ADVANCED">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="duration">Duration (weeks)</Label>
                <Input
                  id="duration"
                  name="duration"
                  type="number"
                  min="1"
                  value={formData.duration}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="thumbnail">Course Thumbnail</Label>
                <input
                  type="file"
                  id="thumbnail"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setFormData(prev => ({
                        ...prev,
                        thumbnail: file
                      }));
                    }
                  }}
                  className="mt-1 block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-md file:border-0
                    file:text-sm file:font-semibold
                    file:bg-primary-50 file:text-primary-700
                    hover:file:bg-primary-100"
                  required={!isEditing}
                />
                <div className="mt-2">
                  {formData.thumbnail instanceof File ? (
                    <img
                      src={URL.createObjectURL(formData.thumbnail)}
                      alt="New thumbnail preview"
                      className="h-32 w-32 object-cover rounded-lg"
                    />
                  ) : isEditing && currentCourse?.thumbnail ? (
                    <img
                      src={getFileUrl(currentCourse.thumbnail)}
                      alt="Current thumbnail"
                      className="h-32 w-32 object-cover rounded-lg"
                    />
                  ) : null}
                </div>
              </div>
            </div>

            {/* Sections */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Course Sections</h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddSection}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Section
                </Button>
              </div>

              {formData.sections.map((section, sectionIndex) => (
                <div key={sectionIndex} className="border rounded-lg p-4 space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="flex-1">
                      <Input
                        placeholder="Section Name"
                        value={section.name}
                        onChange={(e) => handleSectionChange(sectionIndex, 'name', e.target.value)}
                        required
                      />
                    </div>
                    <div className="flex items-center gap-2 ml-2">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleSection(sectionIndex)}
                      >
                        {expandedSections.includes(sectionIndex) ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </Button>
                      {formData.sections.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveSection(sectionIndex)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      )}
                    </div>
                  </div>

                  {expandedSections.includes(sectionIndex) && (
                    <div className="space-y-4 pl-4">
                      {section.videos.map((video, videoIndex) => (
                        <div key={videoIndex} className="flex gap-2 items-start">
                          <div className="flex-1 space-y-2">
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <label className="block text-sm font-medium text-gray-700">Video Name</label>
                                  <input
                                    type="text"
                                    value={video.name}
                                    onChange={(e) => handleVideoChange(sectionIndex, videoIndex, 'name', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                                    required
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700">Video Duration (minutes)</label>
                                  <input
                                    type="number"
                                    min="0"
                                    value={video.duration}
                                    onChange={(e) => handleVideoChange(sectionIndex, videoIndex, 'duration', parseInt(e.target.value))}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                                    required
                                  />
                                </div>
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700">Video File</label>
                                <input
                                  type="file"
                                  accept="video/*"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                      handleVideoChange(sectionIndex, videoIndex, 'file', file);
                                    }
                                  }}
                                  className="mt-1 block w-full text-sm text-gray-500
                                    file:mr-4 file:py-2 file:px-4
                                    file:rounded-md file:border-0
                                    file:text-sm file:font-semibold
                                    file:bg-primary-50 file:text-primary-700
                                    hover:file:bg-primary-100"
                                  required={!isEditing}
                                />
                                {isEditing && !video.file && video.filePath && (
                                  <div className="mt-2">
                                    <div className="text-sm text-gray-500 flex items-center justify-between">
                                      <span>Current video: {video.name}</span>
                                      <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                                        Duration: {video.duration} minutes
                                      </span>
                                    </div>
                                    <video 
                                      key={video.filePath}
                                      src={getFileUrl(video.filePath)}
                                      className="mt-2 w-full max-w-md rounded-lg"
                                      controls
                                      preload="metadata"
                                    >
                                      <source src={getFileUrl(video.filePath)} type="video/mp4" />
                                      Your browser does not support the video tag.
                                    </video>
                                  </div>
                                )}
                                {video.file instanceof File && (
                                  <div className="mt-2">
                                    <div className="text-sm text-gray-500 flex items-center justify-between">
                                      <span>New video: {video.file.name}</span>
                                      <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                                        Duration: {video.duration} minutes
                                      </span>
                                    </div>
                                    <video 
                                      key={video.file.name}
                                      src={URL.createObjectURL(video.file)}
                                      className="mt-2 w-full max-w-md rounded-lg"
                                      controls
                                      preload="metadata"
                                    >
                                      <source src={URL.createObjectURL(video.file)} type="video/mp4" />
                                      Your browser does not support the video tag.
                                    </video>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                          {section.videos.length > 1 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveVideo(sectionIndex, videoIndex)}
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          )}
                        </div>
                      ))}
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleAddVideo(sectionIndex)}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Video
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCloseModal}>
                Cancel
              </Button>
              <Button type="submit" disabled={formLoading}>
                {formLoading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                ) : (
                  isEditing ? 'Update Course' : 'Create Course'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <div className="mb-4">
        <h2 className="text-lg font-semibold">Course List</h2>
        <p className="text-sm text-gray-500">{courses.length} courses available</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="bg-white p-6 rounded-lg shadow text-center">
            <h3 className="font-bold mb-2">No courses found</h3>
            <p className="text-gray-600">
              Try adjusting your search or filter criteria
            </p>
          </div>
        ) : (
          filteredCourses.map(course => (
            <div key={course.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="flex flex-col md:flex-row">
                <div className="md:w-1/4">
                  <img 
                    src={getFileUrl(course.thumbnail)} 
                    alt={course.name} 
                    className="w-full h-48 md:h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/placeholder-image.jpg';
                    }}
                  />
                </div>
                <div className="p-4 md:w-3/4 flex flex-col">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-2">
                    <div>
                      <span className={`
                        inline-block px-2 py-1 text-xs font-semibold rounded 
                        ${course.level === 'BEGINNER' ? 'bg-green-100 text-green-800' : ''}
                        ${course.level === 'INTERMEDIATE' ? 'bg-blue-100 text-blue-800' : ''}
                        ${course.level === 'ADVANCED' ? 'bg-red-100 text-red-800' : ''}
                      `}>
                        {course.level}
                      </span>
                      <span className="inline-block ml-2 px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded">
                        {course.category}
                      </span>
                    </div>
                    <div className="mt-2 md:mt-0 text-lg font-bold text-primary">${course.price}</div>
                  </div>
                  
                  <h3 className="text-xl font-bold mb-2">{course.name}</h3>
                  <p className="text-sm text-gray-600 mb-4 flex-grow">{course.description}</p>
                  
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-4">
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"/>
                        <polyline points="12 6 12 12 16 14"/>
                      </svg>
                      <span>{course.duration} weeks</span>
                    </div>
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2"/>
                        <circle cx="9" cy="7" r="4"/>
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                      </svg>
                      <span>{course.enrolledStudents} students</span>
                    </div>
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                        <line x1="16" y1="2" x2="16" y2="6"/>
                        <line x1="8" y1="2" x2="8" y2="6"/>
                        <line x1="3" y1="10" x2="21" y2="10"/>
                      </svg>
                      <span>Created {new Date(course.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-blue-600 border-blue-600 hover:bg-blue-50"
                      onClick={() => handleOpenModal(course)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                      </svg>
                      Edit
                    </Button>
                    
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminCourses;
