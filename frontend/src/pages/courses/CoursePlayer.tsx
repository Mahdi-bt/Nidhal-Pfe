import React, { useState, useEffect, useRef } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import MainLayout from '@/components/Layout/MainLayout';
import { getCourseById, updateVideoProgress } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/sonner';

interface Video {
  id: string;
  name: string;
  duration: number;
  filePath: string;
  progress?: number;
  lastPosition?: number;
  watched?: boolean;
}

interface Section {
  id: string;
  name: string;
  videos: Video[];
  progress?: number;
}

interface Course {
  id: string;
  name: string;
  description: string;
  sections: Section[];
}

const CoursePlayer = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentSection, setCurrentSection] = useState<Section | null>(null);
  const [currentVideo, setCurrentVideo] = useState<Video | null>(null);
  const [autoPlayNext, setAutoPlayNext] = useState(true);
  const [isUpdatingProgress, setIsUpdatingProgress] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressUpdateTimeoutRef = useRef<NodeJS.Timeout>();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Progress update interval (in seconds)
  const PROGRESS_UPDATE_INTERVAL = 5;
  const WATCHED_THRESHOLD = 90; // 90% watched to mark as completed

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        if (courseId) {
          const data = await getCourseById(courseId);
          setCourse(data);
          
          if (data.sections.length > 0) {
            // Find the first unwatched video or start from the beginning
            const firstSection = data.sections[0];
            const firstVideo = firstSection.videos[0];
            setCurrentSection(firstSection);
            setCurrentVideo(firstVideo);

            // If there's a video in progress, start from there
            const inProgressVideo = findInProgressVideo(data.sections);
            if (inProgressVideo) {
              setCurrentSection(inProgressVideo.section);
              setCurrentVideo(inProgressVideo.video);
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

    // Cleanup function
    return () => {
      if (progressUpdateTimeoutRef.current) {
        clearTimeout(progressUpdateTimeoutRef.current);
      }
    };
  }, [courseId, isAuthenticated, navigate]);

  const findInProgressVideo = (sections: Section[]) => {
    for (const section of sections) {
      for (const video of section.videos) {
        if (video.progress && video.progress > 0 && video.progress < WATCHED_THRESHOLD) {
          return { section, video };
        }
      }
    }
    return null;
  };

  const handleVideoSelect = (sectionId: string, videoId: string) => {
    if (!course) return;
    
    const section = course.sections.find(s => s.id === sectionId);
    if (section) {
      const video = section.videos.find(v => v.id === videoId);
      if (video) {
        setCurrentSection(section);
        setCurrentVideo(video);
        if (videoRef.current) {
          videoRef.current.currentTime = video.lastPosition || 0;
        }
      }
    }
  };

  const handleVideoProgress = async (progress: number, currentTime: number) => {
    if (currentVideo && courseId && !isUpdatingProgress) {
      // Clear any existing timeout
      if (progressUpdateTimeoutRef.current) {
        clearTimeout(progressUpdateTimeoutRef.current);
      }

      // Set a new timeout to update progress
      progressUpdateTimeoutRef.current = setTimeout(async () => {
        try {
          setIsUpdatingProgress(true);
          const result = await updateVideoProgress(currentVideo.id, {
            progress,
            lastPosition: currentTime
          });

          // Update local state with new progress
          if (result.courseProgress) {
            setCourse(prev => {
              if (!prev) return null;
              return {
                ...prev,
                sections: prev.sections.map(section => {
                  const updatedSection = result.courseProgress.sections.find(s => s.id === section.id);
                  if (updatedSection) {
                    return {
                      ...section,
                      progress: updatedSection.progress,
                      videos: section.videos.map(video => {
                        const updatedVideo = updatedSection.videoProgress.find(vp => vp.videoId === video.id);
                        if (updatedVideo) {
                          return {
                            ...video,
                            progress: updatedVideo.progress,
                            lastPosition: updatedVideo.lastPosition,
                            watched: updatedVideo.watched
                          };
                        }
                        return video;
                      })
                    };
                  }
                  return section;
                })
              };
            });
          }

          // If video is watched and auto-play is enabled, play next video
          if (progress >= WATCHED_THRESHOLD && autoPlayNext) {
            playNextVideo();
          }
        } catch (error) {
          console.error('Error updating video progress:', error);
          toast.error('Failed to update progress');
        } finally {
          setIsUpdatingProgress(false);
        }
      }, PROGRESS_UPDATE_INTERVAL * 1000);
    }
  };

  const playNextVideo = () => {
    if (!course || !currentSection || !currentVideo) return;

    const currentSectionIndex = course.sections.findIndex(s => s.id === currentSection.id);
    const currentVideoIndex = currentSection.videos.findIndex(v => v.id === currentVideo.id);

    // Try to play next video in current section
    if (currentVideoIndex < currentSection.videos.length - 1) {
      const nextVideo = currentSection.videos[currentVideoIndex + 1];
      setCurrentVideo(nextVideo);
      if (videoRef.current) {
        videoRef.current.currentTime = nextVideo.lastPosition || 0;
      }
      return;
    }

    // Try to play first video of next section
    if (currentSectionIndex < course.sections.length - 1) {
      const nextSection = course.sections[currentSectionIndex + 1];
      const nextVideo = nextSection.videos[0];
      setCurrentSection(nextSection);
      setCurrentVideo(nextVideo);
      if (videoRef.current) {
        videoRef.current.currentTime = nextVideo.lastPosition || 0;
      }
    }
  };

  const playPreviousVideo = () => {
    if (!course || !currentSection || !currentVideo) return;

    const currentSectionIndex = course.sections.findIndex(s => s.id === currentSection.id);
    const currentVideoIndex = currentSection.videos.findIndex(v => v.id === currentVideo.id);

    // Try to play previous video in current section
    if (currentVideoIndex > 0) {
      const prevVideo = currentSection.videos[currentVideoIndex - 1];
      setCurrentVideo(prevVideo);
      if (videoRef.current) {
        videoRef.current.currentTime = prevVideo.lastPosition || 0;
      }
      return;
    }

    // Try to play last video of previous section
    if (currentSectionIndex > 0) {
      const prevSection = course.sections[currentSectionIndex - 1];
      const prevVideo = prevSection.videos[prevSection.videos.length - 1];
      setCurrentSection(prevSection);
      setCurrentVideo(prevVideo);
      if (videoRef.current) {
        videoRef.current.currentTime = prevVideo.lastPosition || 0;
      }
    }
  };

  const markVideoAsWatched = async () => {
    if (currentVideo && courseId) {
      try {
        await updateVideoProgress(currentVideo.id, {
          progress: 100,
          lastPosition: currentVideo.duration
        });
        toast.success('Video marked as watched');
        if (autoPlayNext) {
          playNextVideo();
        }
      } catch (error) {
        console.error('Error marking video as watched:', error);
        toast.error('Failed to mark video as watched');
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
                    <div className="aspect-w-16 aspect-h-9 bg-black">
                      <video
                        ref={videoRef}
                        key={currentVideo.id}
                        className="w-full h-full"
                        controls
                        src={`http://localhost:3000/${currentVideo.filePath}`}
                        onTimeUpdate={(e) => {
                          const video = e.currentTarget;
                          const progress = (video.currentTime / video.duration) * 100;
                          handleVideoProgress(progress, video.currentTime);
                        }}
                        onEnded={() => {
                          if (autoPlayNext) {
                            playNextVideo();
                          }
                        }}
                      />
                    </div>
                    <div className="p-4">
                      <h2 className="text-xl font-bold mb-1">{currentVideo.name}</h2>
                      <p className="text-gray-600 text-sm">
                        {currentSection?.name} • {Math.floor(currentVideo.duration / 60)}:{(currentVideo.duration % 60).toString().padStart(2, '0')} min
                      </p>
                    </div>
                    <div className="bg-gray-100 px-4 py-3 flex justify-between items-center">
                      <div className="flex space-x-4">
                        <button 
                          onClick={playPreviousVideo}
                          className="text-gray-600 hover:text-primary flex items-center"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                            <path d="m15 18-6-6 6-6"/>
                          </svg>
                          <span className="text-sm">Previous Lesson</span>
                        </button>
                        <button 
                          onClick={playNextVideo}
                          className="text-gray-600 hover:text-primary flex items-center"
                        >
                          <span className="text-sm">Next Lesson</span>
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1">
                            <path d="m9 18 6-6-6-6"/>
                          </svg>
                        </button>
                      </div>
                      <div className="flex items-center space-x-4">
                        <label className="flex items-center space-x-2 text-sm text-gray-600">
                          <input
                            type="checkbox"
                            checked={autoPlayNext}
                            onChange={(e) => setAutoPlayNext(e.target.checked)}
                            className="form-checkbox"
                          />
                          <span>Auto-play next</span>
                        </label>
                        <button
                          onClick={markVideoAsWatched}
                          className="text-sm text-primary hover:underline"
                        >
                          Mark as Watched
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="p-8 text-center">
                    <p>No video selected. Please choose a video from the course curriculum.</p>
                  </div>
                )}
              </div>
              
           
            </div>
            
            {/* Course Curriculum Column */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-4 bg-primary text-white">
                <h2 className="font-bold">Course Curriculum</h2>
              </div>
              <div className="divide-y">
                {course.sections.map((section) => (
                  <div key={section.id} className="p-4">
                    <h3 className="font-semibold mb-2">{section.name}</h3>
                    <div className="space-y-2">
                      {section.videos.map((video) => (
                        <button
                          key={video.id}
                          onClick={() => handleVideoSelect(section.id, video.id)}
                          className={`w-full text-left p-2 rounded-md flex items-center space-x-2 ${
                            currentVideo?.id === video.id
                              ? 'bg-primary/10 text-primary'
                              : 'hover:bg-gray-100'
                          }`}
                        >
                          <div className="flex-1">
                            <p className="text-sm font-medium">{video.name}</p>
                            <p className="text-xs text-gray-500">
                              {Math.floor(video.duration / 60)}:{(video.duration % 60).toString().padStart(2, '0')} min
                            </p>
                          </div>
                          {video.watched && (
                            <svg
                              className="w-5 h-5 text-green-500"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          )}
                          {video.progress && !video.watched && (
                            <div className="w-5 h-5">
                              <svg
                                className="w-5 h-5 text-primary"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <circle
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  strokeWidth="2"
                                  className="text-gray-200"
                                  fill="none"
                                />
                                <circle
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  strokeWidth="2"
                                  className="text-primary"
                                  fill="none"
                                  strokeDasharray={`${video.progress * 62.8} 62.8`}
                                  transform="rotate(-90 12 12)"
                                />
                              </svg>
                            </div>
                          )}
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
