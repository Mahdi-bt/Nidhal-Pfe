import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import MainLayout from '@/components/Layout/MainLayout';
import { useAuth } from '@/contexts/AuthContext';
import { getEnrolledCourses, Course } from '@/lib/api';
import CourseProgress from '@/components/Course/CourseProgress';
import { Button } from '@/components/ui/button';

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

const Dashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const [enrolledCourses, setEnrolledCourses] = useState<CourseWithProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const fetchEnrolledCourses = async () => {
      try {
        if (!user) return;
        const data = await getEnrolledCourses(user.id);
        setEnrolledCourses(data);
      } catch (error) {
        console.error('Error fetching enrolled courses:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchEnrolledCourses();
  }, [user, isAuthenticated, navigate]);

  // For statistics
  const statsCourses = enrolledCourses.map((c) => ({
    id: c.id,
    name: c.name,
    progress: typeof c.progress === 'number' ? c.progress : (c.progress?.overall ?? 0)
  }));

  // For in-progress display (full objects)
  const inProgressCourses = enrolledCourses.filter((c) => {
    const progress = typeof c.progress === 'number' ? c.progress : (c.progress?.overall ?? 0);
    return progress > 0 && progress < 1;
  });

  // Derive statistics from enrolledCourses
  const completedCourses = statsCourses.filter(c => c.progress >= 1);
  const notStartedCourses = statsCourses.filter(c => c.progress === 0);
  const avgProgress = statsCourses.length
    ? statsCourses.reduce((sum, c) => sum + (c.progress || 0), 0) / statsCourses.length
    : 0;

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            Welcome back, {user?.name ? user.name.split(' ')[0] : 'Student'}!
          </h1>
          <p className="text-gray-600">
            Continue your learning journey right where you left off.
          </p>
        </div>

        {/* Average Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-semibold">Average Course Progress</h2>
            <span className="text-primary font-bold">{Math.round(avgProgress * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-primary h-3 rounded-full transition-all duration-300"
              style={{ width: `${avgProgress * 100}%` }}
            ></div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-primary text-white rounded-lg shadow-md p-6 flex flex-col">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold mb-4">Enrolled Courses</h3>
                <p className="text-4xl font-bold">{enrolledCourses.length}</p>
              </div>
              <div className="bg-white/20 p-2 rounded">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
                  <path d="M6 12v5c3 3 9 3 12 0v-5"/>
                </svg>
              </div>
            </div>
            <Link to="/my-courses" className="mt-auto text-sm text-white/80 hover:text-white flex items-center">
              View all courses
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1">
                <path d="M5 12h14"/>
                <path d="m12 5 7 7-7 7"/>
              </svg>
            </Link>
          </div>
          
          <div className="bg-green-500 text-white rounded-lg shadow-md p-6 flex flex-col">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold mb-4">In Progress</h3>
                <p className="text-4xl font-bold">{inProgressCourses.length}</p>
              </div>
              <div className="bg-white/20 p-2 rounded">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7 3 9 6 15 3-6 6-8 6-15Z"/>
                  <circle cx="12" cy="8" r="2"/>
                </svg>
              </div>
            </div>
            <Link to="/my-courses?filter=in-progress" className="mt-auto text-sm text-white/80 hover:text-white flex items-center">
              Continue learning
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1">
                <path d="M5 12h14"/>
                <path d="m12 5 7 7-7 7"/>
              </svg>
            </Link>
          </div>
          
          <div className="bg-blue-500 text-white rounded-lg shadow-md p-6 flex flex-col">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold mb-4">Completed</h3>
                <p className="text-4xl font-bold">{completedCourses.length}</p>
              </div>
              <div className="bg-white/20 p-2 rounded">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                  <path d="m9 11 3 3L22 4"/>
                </svg>
              </div>
            </div>
            
          </div>
        </div>
        
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Continue Learning</h2>
            <Link to="/my-courses" className="text-primary hover:underline">
              View all courses
            </Link>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : enrolledCourses.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
                <path d="M6 12v5c3 3 9 3 12 0v-5"/>
              </svg>
              <h3 className="text-xl font-bold mb-2">You haven't started any courses yet.</h3>
              <p className="text-gray-600 mb-6">
                Explore our catalog and find courses that interest you
              </p>
              <Button asChild>
                <Link to="/courses">Browse Courses</Link>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {inProgressCourses.length > 0 ? (
                inProgressCourses.slice(0, 3).map(course => (
                  <CourseProgress key={course.id} course={course} />
                ))
              ) : enrolledCourses.slice(0, 3).map(course => (
                <CourseProgress key={course.id} course={course} />
              ))}
            </div>
          )}
        </div>
        
        
      </div>
    </MainLayout>
  );
};

export default Dashboard;
