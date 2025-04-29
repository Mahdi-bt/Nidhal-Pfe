"use client"

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import StudentLayout from '../../components/layout/StudentLayout';
import { useAuth } from '../../contexts/AuthContext';
import { mockApiService } from '../../services/mockData';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    enrolledCourses: 0,
    inProgressCourses: 0,
    completedCourses: 0,
    upcomingSessions: []
  });
  const [recentCourses, setRecentCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // In a real app, these would be actual API calls
        const statsResponse = await mockApiService.getStudentStats(user.id);
        const coursesResponse = await mockApiService.getRecentCourses(user.id);
        
        setStats(statsResponse.data);
        setRecentCourses(coursesResponse.data.slice(0, 3));
        setLoading(false);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setLoading(false);
      }
    };

    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  // Sample data for demonstration purposes
  const achievements = [
    { id: 1, title: "First Course Completed", description: "Completed your first course", icon: "🏆" },
    { id: 2, title: "Perfect Attendance", description: "Attended all sessions for a month", icon: "🌟" },
    { id: 3, title: "Fast Learner", description: "Completed a course in record time", icon: "⚡" }
  ];

  return (
    <StudentLayout>
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      ) : (
        <>
          {/* Welcome Section */}
          <div className="mb-12">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome back, {user.first_name}!
            </h1>
            <p className="text-lg text-gray-600">
              Continue your learning journey right where you left off.
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg p-6 text-white">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Enrolled Courses</h3>
                <div className="p-2 bg-white/20 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M12 14l9-5-9-5-9 5 9 5z" />
                    <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
                  </svg>
                </div>
              </div>
              <p className="text-3xl font-bold mt-4">{stats.enrolledCourses}</p>
              <div className="mt-4 text-blue-100">
                <Link to="/my-courses" className="flex items-center hover:text-white">
                  <span>View all courses</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg p-6 text-white">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">In Progress</h3>
                <div className="p-2 bg-white/20 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
              </div>
              <p className="text-3xl font-bold mt-4">{stats.inProgressCourses}</p>
              <div className="mt-4 text-green-100">
                <Link to="/my-courses" className="flex items-center hover:text-white">
                  <span>Continue learning</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-500 to-violet-600 rounded-xl shadow-lg p-6 text-white">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Completed</h3>
                <div className="p-2 bg-white/20 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <p className="text-3xl font-bold mt-4">{stats.completedCourses}</p>
              <div className="mt-4 text-purple-100">
                <Link to="/my-courses" className="flex items-center hover:text-white">
                  <span>View certificates</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>

          {/* Continue Learning Section */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Continue Learning</h2>
              <Link to="/my-courses" className="text-indigo-600 hover:text-indigo-800 flex items-center text-sm font-medium">
                View all courses
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recentCourses.length > 0 ? (
                recentCourses.map((course) => (
                  <div key={course.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                    <div className="h-40 bg-gradient-to-r from-indigo-500 to-blue-600 relative overflow-hidden">
                      {course.thumbnail ? (
                        <img
                          src={course.thumbnail}
                          alt={course.title}
                          className="w-full h-full object-cover mix-blend-overlay opacity-75"
                        />
                      ) : null}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <h3 className="text-white text-lg font-bold text-center px-4">{course.title}</h3>
                      </div>
                    </div>
                    <div className="p-5">
                      <div className="flex justify-between items-center mb-4">
                        <span className="px-3 py-1 text-xs font-semibold text-indigo-800 bg-indigo-100 rounded-full">
                          {course.level}
                        </span>
                        <span className="text-sm font-medium text-green-600">
                          {course.progress}% Complete
                        </span>
                      </div>

                      <div className="mb-4">
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div
                            className="bg-indigo-600 h-1.5 rounded-full"
                            style={{ width: `${course.progress}%` }}
                          ></div>
                        </div>
                      </div>

                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{course.description}</p>

                      <Link
                        to={`/courses/${course.id}`}
                        className="block w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-center rounded-lg transition-colors duration-300"
                      >
                        Continue
                      </Link>
                    </div>
                  </div>
                ))
              ) : (
                <div className="md:col-span-3 bg-white p-6 rounded-xl shadow text-center">
                  <p className="text-gray-500 mb-4">You haven't started any courses yet.</p>
                  <Link
                    to="/courses"
                    className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                  >
                    Browse Courses
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Achievements and Upcoming Sessions Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Achievements */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Your Achievements</h2>
              <div className="space-y-4">
                {achievements.map((achievement) => (
                  <div key={achievement.id} className="flex items-start p-3 bg-gray-50 rounded-lg">
                    <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center mr-3 text-xl">
                      {achievement.icon}
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{achievement.title}</h3>
                      <p className="text-gray-500 text-sm">{achievement.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Upcoming Sessions */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Upcoming Sessions</h2>
              {stats.upcomingSessions.length > 0 ? (
                <div className="space-y-4">
                  {stats.upcomingSessions.map((session) => (
                    <div key={session.id} className="flex justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <h3 className="font-medium text-gray-900">{session.title}</h3>
                        <p className="text-gray-500 text-sm">{session.course}</p>
                      </div>
                      <div className="text-right">
                        <span className="block text-indigo-600 font-medium">{session.date}</span>
                        <span className="block text-gray-500 text-sm">{session.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">No upcoming sessions scheduled.</p>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </StudentLayout>
  );
};

export default Dashboard;
