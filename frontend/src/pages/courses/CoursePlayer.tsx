
import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import MainLayout from '@/components/Layout/MainLayout';
import { getCourseById, updateVideoProgress } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/sonner';

const CoursePlayer = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentSection, setCurrentSection] = useState<any>(null);
  const [currentVideo, setCurrentVideo] = useState<any>(null);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        if (courseId) {
          const data = await getCourseById(courseId);
          setCourse(data);
          
          if (data.sections.length > 0) {
            setCurrentSection(data.sections[0]);
            if (data.sections[0].videos.length > 0) {
              setCurrentVideo(data.sections[0].videos[0]);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching course:', error);
        toast.error('Failed to load course');
      } finally {
        setLoading(false);
      }
    };
    
    if (!isAuthenticated) {
      toast.error('Please login to access this course');
      navigate('/login');
      return;
    }
    
    fetchCourse();
  }, [courseId, isAuthenticated, navigate]);

  const handleVideoSelect = (sectionId: string, videoId: string) => {
    const section = course.sections.find((s: any) => s.id === sectionId);
    if (section) {
      const video = section.videos.find((v: any) => v.id === videoId);
      if (video) {
        setCurrentSection(section);
        setCurrentVideo(video);
      }
    }
  };

  const handleVideoProgress = async (progress: number, currentTime: number) => {
    if (currentVideo) {
      try {
        await updateVideoProgress(currentVideo.id, {
          progress,
          lastPosition: currentTime
        });
      } catch (error) {
        console.error('Error updating video progress:', error);
      }
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </MainLayout>
    );
  }

  if (!course) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Course Not Found</h1>
          <p className="mb-8">The course you are looking for does not exist or has been removed.</p>
          <Link to="/my-courses" className="btn-primary">
            My Courses
          </Link>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="bg-gray-100 min-h-screen pb-12">
        {/* Course Header */}
        <div className="bg-gray-800 text-white py-4">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center">
              <h1 className="text-xl font-bold truncate">{course.name}</h1>
              <Link to={`/courses/${courseId}`} className="text-sm hover:underline">
                Course Details
              </Link>
            </div>
          </div>
        </div>
        
        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Video Player Column */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                {currentVideo ? (
                  <>
                    <div className="aspect-w-16 aspect-h-9 bg-black relative">
                      {/* In a real implementation, this would be a proper video player component */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="64"
                          height="64"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="text-white opacity-80"
                        >
                          <circle cx="12" cy="12" r="10" />
                          <polygon points="10 8 16 12 10 16 10 8" />
                        </svg>
                      </div>
                    </div>
                    <div className="p-4">
                      <h2 className="text-xl font-bold mb-1">{currentVideo.name}</h2>
                      <p className="text-gray-600 text-sm">
                        {currentSection.name} • {Math.floor(currentVideo.duration / 60)}:{(currentVideo.duration % 60).toString().padStart(2, '0')} min
                      </p>
                    </div>
                    <div className="bg-gray-100 px-4 py-3 flex justify-between items-center">
                      <div className="flex space-x-4">
                        <button className="text-gray-600 hover:text-primary flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                            <path d="m9 18 6-6-6-6"/>
                          </svg>
                          <span className="text-sm">Next Lesson</span>
                        </button>
                        <button className="text-gray-600 hover:text-primary flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                            <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3z"/>
                            <path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/>
                          </svg>
                          <span className="text-sm">Mark Complete</span>
                        </button>
                      </div>
                      <div className="text-sm text-gray-500">
                        1 of {course.sections.reduce((acc: number, section: any) => acc + section.videos.length, 0)} lessons
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="p-8 text-center">
                    <p>No video selected. Please choose a video from the course curriculum.</p>
                  </div>
                )}
              </div>
              
              {/* Notes Section */}
              <div className="mt-8 bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-4 border-b">
                  <h2 className="font-bold">Your Notes</h2>
                </div>
                <div className="p-4">
                  <textarea 
                    className="w-full h-32 p-3 border border-gray-300 rounded-md" 
                    placeholder="Take notes as you watch..."
                  ></textarea>
                  <div className="mt-2 flex justify-end">
                    <button className="btn-primary">Save Notes</button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Course Curriculum Column */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-4 bg-primary text-white">
                <h2 className="font-bold">Course Curriculum</h2>
              </div>
              
              <div className="p-4 max-h-[600px] overflow-y-auto">
                {course.sections.map((section: any) => (
                  <div key={section.id} className="mb-4">
                    <h3 className="font-bold mb-2">{section.name}</h3>
                    <div className="space-y-2">
                      {section.videos.map((video: any) => (
                        <button
                          key={video.id}
                          className={`w-full text-left p-3 rounded flex items-start ${
                            currentVideo && currentVideo.id === video.id 
                              ? 'bg-primary/10 border-l-4 border-primary' 
                              : 'hover:bg-gray-50'
                          }`}
                          onClick={() => handleVideoSelect(section.id, video.id)}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`mr-2 mt-1 ${
                            currentVideo && currentVideo.id === video.id ? 'text-primary' : 'text-gray-400'
                          }`}>
                            <circle cx="12" cy="12" r="10"/>
                            <polygon points="10 8 16 12 10 16 10 8"/>
                          </svg>
                          <div className="flex-grow">
                            <div className="text-sm font-medium">{video.name}</div>
                            <div className="text-xs text-gray-500">
                              {Math.floor(video.duration / 60)}:{(video.duration % 60).toString().padStart(2, '0')} min
                            </div>
                          </div>
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 mt-1">
                            <path d="M20 6 9 17l-5-5"/>
                          </svg>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default CoursePlayer;
