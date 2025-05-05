import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import MainLayout from '@/components/Layout/MainLayout';
import { useAuth } from '@/contexts/AuthContext';
import { getEnrolledCourses, Course, Payment, downloadInvoice, getMyTransactions } from '@/lib/api';
import CourseProgress from '@/components/Course/CourseProgress';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, Clock, XCircle } from 'lucide-react';
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

const Dashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const [enrolledCourses, setEnrolledCourses] = useState<CourseWithProgress[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const fetchData = async () => {
      try {
        if (!user) return;
        const [coursesData, paymentsData] = await Promise.all([
          getEnrolledCourses(user.id),
          getMyTransactions()
        ]);
        setEnrolledCourses(coursesData);
        setPayments(paymentsData);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
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
  console.log(enrolledCourses);
  // Derive statistics from enrolledCourses
  const completedCourses = enrolledCourses.filter(c => {
    const progress = typeof c.progress === 'number' ? c.progress : (c.progress?.overall ?? 0);
    return progress >= 1 || c.progress?.completed === true;
  });
  const notStartedCourses = enrolledCourses.filter(c => {
    const progress = typeof c.progress === 'number' ? c.progress : (c.progress?.overall ?? 0);
    return progress === 0;
  });
  const avgProgress = statsCourses.length
    ? statsCourses.reduce((sum, c) => sum + (c.progress || 0), 0) / statsCourses.length
    : 0;

  // Format currency
  const formatter = (value: number): string => {
    return `${value.toLocaleString()} TND`;
  };

  // Handle invoice download
  const handleDownloadInvoice = async (paymentId: string) => {
    try {
      const response = await downloadInvoice(paymentId);
      const blob = new Blob([response], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `invoice-${paymentId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading invoice:', error);
      toast.error('Failed to download invoice');
    }
  };

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
          ) : inProgressCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {inProgressCourses.slice(0, 3).map(course => (
                <CourseProgress key={course.id} course={course} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
                <path d="M6 12v5c3 3 9 3 12 0v-5"/>
              </svg>
              <h3 className="text-xl font-bold mb-2">No courses in progress</h3>
              <p className="text-gray-600 mb-6">
                Start a new course or continue your learning journey
              </p>
              <Button asChild>
                <Link to="/courses">Browse Courses</Link>
              </Button>
            </div>
          )}
        </div>
        
        {/* Transaction History Section */}
        <div className="mt-12">
          <Card>
            <CardHeader>
              <CardTitle>Transaction History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Transaction ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {loading ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-4 text-center">
                          <div className="flex justify-center">
                            <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-primary"></div>
                          </div>
                        </td>
                      </tr>
                    ) : payments.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                          No transactions found
                        </td>
                      </tr>
                    ) : (
                      payments.map((payment) => (
                        <tr key={payment.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {payment.id}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatter(payment.amount)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              payment.status === 'completed' ? 'bg-green-100 text-green-800' :
                              payment.status === 'failed' ? 'bg-red-100 text-red-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {payment.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(payment.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            {(() => {
                              const status = payment.status.toLowerCase();
                              switch (status) {
                                case 'completed':
                                  return (
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleDownloadInvoice(payment.id)}
                                      className="text-primary hover:text-primary/80"
                                    >
                                      <Download className="h-4 w-4 mr-1" />
                                      Download Invoice
                                    </Button>
                                  );
                                case 'pending':
                                  return (
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="text-yellow-600 hover:text-yellow-700"
                                      disabled
                                    >
                                      <Clock className="h-4 w-4 mr-1" />
                                      Pending
                                    </Button>
                                  );
                                case 'failed':
                                  return (
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="text-red-600 hover:text-red-700"
                                      disabled
                                    >
                                      <XCircle className="h-4 w-4 mr-1" />
                                      Failed
                                    </Button>
                                  );
                                default:
                                  return null;
                              }
                            })()}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
