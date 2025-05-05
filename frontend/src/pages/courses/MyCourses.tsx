import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '@/components/Layout/MainLayout';
import CourseProgress from '@/components/Course/CourseProgress';
import { useAuth } from '@/contexts/AuthContext';
import { getEnrolledCourses, Course } from '@/lib/api';
import { toast } from '@/components/ui/sonner';

type CourseWithProgress = Course & {
  progress: {
    overall: number;
    completed: boolean;
    sections: Array<{
      id: string;
      name: string;
      progress: number;
      videoProgress: Array<{
        id: string;
        videoId: string;
        watched: boolean;
        progress: number;
        lastPosition: number;
      }>;
    }>;
  };
};

const MyCourses = () => {
  const { user, isAuthenticated } = useAuth();
  const [enrolledCourses, setEnrolledCourses] = useState<CourseWithProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState('all'); // 'all', 'in-progress', 'completed', 'not-started'
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      try {
        console.log('Starting fetchEnrolledCourses...');
        console.log('Auth state:', { isAuthenticated, userId: user?.id });
        
        if (!isAuthenticated || !user) {
          console.log('User not authenticated, skipping fetch');
          setLoading(false);
          return;
        }

        console.log('Fetching enrolled courses for user:', user.id);
        const data = await getEnrolledCourses(user.id);
        console.log('Received data:', data);

        if (!data) {
          console.error('No data received from API');
          setError('No data received from server');
          return;
        }

        if (!Array.isArray(data)) {
          console.error('Invalid data format received:', data);
          setError('Invalid data format received from server');
          return;
        }

        setEnrolledCourses(data);
        setError(null);
      } catch (error) {
        console.error('Error in fetchEnrolledCourses:', error);
        setError(error instanceof Error ? error.message : 'Failed to load courses');
        toast.error('Failed to load your courses. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchEnrolledCourses();
  }, [user, isAuthenticated]);

  // Filter courses based on progress
  const filteredCourses = enrolledCourses.filter(course => {
    if (!course) return false;
    
    const matchesSearch = course.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         course.description?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = 
      filter === 'all' || 
      (filter === 'in-progress' && course.progress?.overall > 0 && course.progress?.overall < 1) ||
      (filter === 'completed' && (course.progress?.overall >= 1 || course.progress?.completed === true)) ||
      // Not started: course has 0 progress and is not marked as completed
      (filter === 'not-started' && course.progress?.overall === 0 && course.progress?.completed !== true);
    
    return matchesSearch && matchesFilter;
  });

  if (!isAuthenticated) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Please Login to View Your Courses</h1>
          <p className="mb-8">You need to be logged in to access your enrolled courses.</p>
          <Link to="/login" className="btn-primary">
            Login Now
          </Link>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4 text-red-600">Error Loading Courses</h1>
          <p className="mb-8">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="btn-primary"
          >
            Try Again
          </button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="bg-primary py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-white mb-4">My Courses</h1>
          <p className="text-white/80 text-lg">
            Track your progress and continue your learning journey
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-8">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <div className="flex space-x-2 overflow-x-auto">
              <button
                className={`px-4 py-2 rounded-full text-sm font-medium ${
                  filter === 'all' 
                    ? 'bg-primary text-white' 
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
                onClick={() => setFilter('all')}
              >
                All Courses
              </button>
              <button
                className={`px-4 py-2 rounded-full text-sm font-medium ${
                  filter === 'in-progress' 
                    ? 'bg-primary text-white' 
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
                onClick={() => setFilter('in-progress')}
              >
                In Progress
              </button>
              <button
                className={`px-4 py-2 rounded-full text-sm font-medium ${
                  filter === 'completed' 
                    ? 'bg-primary text-white' 
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
                onClick={() => setFilter('completed')}
              >
                Completed
              </button>
              <button
                className={`px-4 py-2 rounded-full text-sm font-medium ${
                  filter === 'not-started' 
                    ? 'bg-primary text-white' 
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
                onClick={() => setFilter('not-started')}
              >
                Not Started
              </button>
            </div>
            <div className="w-full md:w-64">
              <input
                type="text"
                placeholder="Search courses..."
                className="input-field"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <>
            {enrolledCourses.length === 0 ? (
              <div className="text-center py-12">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mx-auto text-gray-400 mb-4"
                >
                  <path d="M20 16V8a2 2 0 00-2-2H6a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2z" />
                  <path d="M10 9l5 3-5 3V9z" />
                </svg>
                <h3 className="text-xl font-bold mb-2">You haven't enrolled in any courses yet</h3>
                <p className="text-gray-600 mb-6">
                  Explore our catalog and find courses that interest you
                </p>
                <Link to="/courses" className="btn-primary">
                  Browse Courses
                </Link>
              </div>
            ) : filteredCourses.length === 0 ? (
              <div className="text-center py-12">
                <h3 className="text-xl font-bold mb-2">No courses found</h3>
                <p className="text-gray-600">
                  Try adjusting your search or filter criteria
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCourses.map((course) => (
                  <CourseProgress key={course.id} course={course} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </MainLayout>
  );
};

export default MyCourses;
