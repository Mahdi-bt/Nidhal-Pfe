"use client"

import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';

const Statistics = () => {
  const { user, getToken } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCourses: 0,
    totalEnrollments: 0,
    usersByRole: { admin: 0, student: 0, instructor: 0 },
    recentEnrollments: [],
    coursesByCategory: [],
    completionRates: [],
  });

  // Simulated statistics data - replace with actual API calls in production
  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        // Simulate API call with mock data
        // In a real implementation, you would fetch this data from your backend
        setTimeout(() => {
          setStats({
            totalUsers: 456,
            totalCourses: 32,
            totalEnrollments: 1204,
            activeUsers: 287,
            usersByRole: { admin: 8, student: 423, instructor: 25 },
            recentEnrollments: [
              { id: 1, user: 'Emily Johnson', course: 'Advanced JavaScript', date: '2023-09-15' },
              { id: 2, user: 'Michael Chen', course: 'Data Science Fundamentals', date: '2023-09-14' },
              { id: 3, user: 'Sarah Williams', course: 'UI/UX Design Principles', date: '2023-09-13' },
              { id: 4, user: 'David Rodriguez', course: 'Full Stack Development', date: '2023-09-12' },
              { id: 5, user: 'Jessica Lee', course: 'Machine Learning Basics', date: '2023-09-11' },
            ],
            coursesByCategory: [
              { category: 'Programming', count: 12 },
              { category: 'Design', count: 8 },
              { category: 'Data Science', count: 6 },
              { category: 'Business', count: 4 },
              { category: 'Marketing', count: 2 },
            ],
            completionRates: [
              { course: 'JavaScript Basics', completion: 87 },
              { course: 'Python Programming', completion: 92 },
              { course: 'React Fundamentals', completion: 78 },
              { course: 'UI/UX Design', completion: 85 },
              { course: 'Data Analysis', completion: 73 },
            ],
            monthlySales: [
              { month: 'Jan', amount: 12000 },
              { month: 'Feb', amount: 15000 },
              { month: 'Mar', amount: 18000 },
              { month: 'Apr', amount: 16000 },
              { month: 'May', amount: 21000 },
              { month: 'Jun', amount: 22000 },
              { month: 'Jul', amount: 20000 },
              { month: 'Aug', amount: 25000 },
              { month: 'Sep', amount: 27000 },
            ],
          });
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching statistics:', error);
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="md:flex md:items-center md:justify-between mb-6">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
              Training Center Statistics
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Comprehensive analytics and insights for your training platform
            </p>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        ) : (
          <>
            {/* Key Metrics Cards */}
            <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {/* Total Users Card */}
              <div className="bg-gradient-to-br from-indigo-500 to-purple-600 overflow-hidden shadow-lg rounded-lg p-5 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 -mt-4 -mr-12 opacity-10">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-32 w-32" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <div className="relative z-10">
                  <div className="flex items-center">
                    <div className="p-2 rounded-lg bg-white/20 mr-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium">Total Users</h3>
                  </div>
                  <div className="mt-4 flex items-baseline">
                    <p className="text-4xl font-bold">{formatNumber(stats.totalUsers)}</p>
                    <span className="ml-2 text-sm font-medium bg-white/20 rounded-full px-2 py-0.5">+12% ↑</span>
                  </div>
                  <div className="mt-4 text-sm opacity-80">
                    <span>Active: {formatNumber(stats.activeUsers)} ({Math.round((stats.activeUsers / stats.totalUsers) * 100)}%)</span>
                  </div>
                </div>
              </div>

              {/* Total Courses Card */}
              <div className="bg-gradient-to-br from-blue-500 to-cyan-600 overflow-hidden shadow-lg rounded-lg p-5 text-white relative">
                <div className="absolute top-0 right-0 -mt-4 -mr-12 opacity-10">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-32 w-32" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <div className="relative z-10">
                  <div className="flex items-center">
                    <div className="p-2 rounded-lg bg-white/20 mr-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path d="M12 14l9-5-9-5-9 5 9 5z" />
                        <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium">Total Courses</h3>
                  </div>
                  <div className="mt-4 flex items-baseline">
                    <p className="text-4xl font-bold">{formatNumber(stats.totalCourses)}</p>
                    <span className="ml-2 text-sm font-medium bg-white/20 rounded-full px-2 py-0.5">+5% ↑</span>
                  </div>
                  <div className="mt-4 text-sm opacity-80">
                    <span>Top category: Programming</span>
                  </div>
                </div>
              </div>

              {/* Total Enrollments Card */}
              <div className="bg-gradient-to-br from-green-500 to-emerald-600 overflow-hidden shadow-lg rounded-lg p-5 text-white relative">
                <div className="absolute top-0 right-0 -mt-4 -mr-12 opacity-10">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-32 w-32" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="relative z-10">
                  <div className="flex items-center">
                    <div className="p-2 rounded-lg bg-white/20 mr-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium">Total Enrollments</h3>
                  </div>
                  <div className="mt-4 flex items-baseline">
                    <p className="text-4xl font-bold">{formatNumber(stats.totalEnrollments)}</p>
                    <span className="ml-2 text-sm font-medium bg-white/20 rounded-full px-2 py-0.5">+18% ↑</span>
                  </div>
                  <div className="mt-4 text-sm opacity-80">
                    <span>Avg per course: {Math.round(stats.totalEnrollments / stats.totalCourses)}</span>
                  </div>
                </div>
              </div>

              {/* Revenue Card */}
              <div className="bg-gradient-to-br from-orange-500 to-amber-600 overflow-hidden shadow-lg rounded-lg p-5 text-white relative">
                <div className="absolute top-0 right-0 -mt-4 -mr-12 opacity-10">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-32 w-32" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="relative z-10">
                  <div className="flex items-center">
                    <div className="p-2 rounded-lg bg-white/20 mr-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 8h6m-5 0a3 3 0 110 6H9l3 3m-3-6h6m6 1a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium">Monthly Revenue</h3>
                  </div>
                  <div className="mt-4 flex items-baseline">
                    <p className="text-4xl font-bold">${formatNumber(27000)}</p>
                    <span className="ml-2 text-sm font-medium bg-white/20 rounded-full px-2 py-0.5">+8% ↑</span>
                  </div>
                  <div className="mt-4 text-sm opacity-80">
                    <span>Up from $25,000 last month</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Charts Section */}
            <div className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-2">
              {/* Revenue Chart */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Monthly Revenue</h3>
                </div>
                <div className="p-5">
                  <div className="h-72 flex flex-col justify-center items-center">
                    <div className="w-full h-full flex items-end space-x-2">
                      {stats.monthlySales?.map((item, index) => (
                        <div key={index} className="flex-1 flex flex-col items-center">
                          <div 
                            className="w-full bg-gradient-to-t from-blue-600 to-indigo-700 rounded-t-sm hover:from-blue-500 hover:to-indigo-600 transition-all duration-300"
                            style={{ 
                              height: `${(item.amount / 30000) * 100}%`,
                              minHeight: '10%'
                            }}
                          >
                            <div className="opacity-0 hover:opacity-100 bg-black/50 text-white p-1 text-xs rounded transition-opacity duration-200 text-center -mt-8">
                              ${formatNumber(item.amount)}
                            </div>
                          </div>
                          <div className="text-xs font-medium mt-2 text-gray-500">{item.month}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* User Role Distribution */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">User Distribution</h3>
                </div>
                <div className="p-5">
                  <div className="h-72 flex justify-center items-center">
                    <div className="relative w-64 h-64">
                      {/* Simulated pie chart using CSS */}
                      <div className="absolute inset-0 flex justify-center items-center">
                        <div className="h-full w-full rounded-full overflow-hidden">
                          <div style={{ height: '100%', background: 'conic-gradient(from 0deg, #4f46e5 0%, #4f46e5 2%, #06b6d4 2%, #06b6d4 8%, #10b981 8%, #10b981 100%)' }}></div>
                        </div>
                        <div className="absolute h-[70%] w-[70%] bg-white rounded-full flex justify-center items-center">
                          <div className="text-center">
                            <div className="text-3xl font-bold text-gray-800">{stats.totalUsers}</div>
                            <div className="text-sm text-gray-500">Total Users</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 mt-4">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-indigo-600 rounded-full mr-2"></div>
                      <span className="text-sm text-gray-700">Admins: {stats.usersByRole.admin}</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-cyan-600 rounded-full mr-2"></div>
                      <span className="text-sm text-gray-700">Instructors: {stats.usersByRole.instructor}</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-emerald-600 rounded-full mr-2"></div>
                      <span className="text-sm text-gray-700">Students: {stats.usersByRole.student}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Table and Course Distribution */}
            <div className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-2">
              {/* Recent Enrollments */}
              <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Recent Enrollments</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {stats.recentEnrollments.map(enrollment => (
                        <tr key={enrollment.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{enrollment.user}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{enrollment.course}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{enrollment.date}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="px-5 py-3 border-t border-gray-200 bg-gray-50 text-right">
                  <button className="text-sm font-medium text-indigo-600 hover:text-indigo-900">View All Enrollments</button>
                </div>
              </div>

              {/* Courses by Category */}
              <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Courses by Category</h3>
                </div>
                <div className="p-5">
                  <div className="space-y-4">
                    {stats.coursesByCategory.map((category, index) => (
                      <div key={index} className="relative">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium text-gray-700">{category.category}</span>
                          <span className="text-sm font-medium text-gray-500">{category.count} courses</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div 
                            className="h-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-blue-600"
                            style={{ width: `${(category.count / 12) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Course Completion Rates */}
            <div className="mt-8">
              <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Course Completion Rates</h3>
                </div>
                <div className="p-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {stats.completionRates.map((course, index) => (
                      <div key={index} className="bg-gray-50 p-4 rounded-lg shadow-sm">
                        <div className="flex justify-between items-center mb-4">
                          <h4 className="text-sm font-semibold text-gray-700 truncate">{course.course}</h4>
                          <span className="text-sm font-bold text-indigo-600">{course.completion}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-1">
                          <div 
                            className={`h-2.5 rounded-full ${
                              course.completion >= 90 ? 'bg-green-600' :
                              course.completion >= 80 ? 'bg-emerald-500' :
                              course.completion >= 70 ? 'bg-yellow-500' :
                              'bg-orange-500'
                            }`}
                            style={{ width: `${course.completion}%` }}
                          ></div>
                        </div>
                        <div className="flex justify-between items-center text-xs text-gray-500">
                          <span>0%</span>
                          <span>50%</span>
                          <span>100%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
};

export default Statistics; 