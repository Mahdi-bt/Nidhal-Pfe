import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import AdminLayout from '@/components/Layout/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { ArrowUpRight, ArrowDownRight, Users, BookOpen, GraduationCap, DollarSign, FileText, Video, Download, Printer, Eye, Clock, XCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import {  getAllCourses, getAllPayments, downloadInvoice, getSuccessfulPaymentsStats, getMonthlyRevenueStats } from '@/lib/api';
import { Course, Payment, PaymentStats, MonthlyRevenue } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/sonner';

// Extend Payment type to include course information
interface PaymentWithCourse extends Payment {
  course?: {
    id: string;
    name: string;
  };
}

// Define type for tooltip value
type ValueType = string | number | Array<string | number>;

// Custom tooltip for charts
const CustomTooltip = ({ active, payload, label }: { 
  active?: boolean; 
  payload?: Array<{ value: ValueType; name: string }>; 
  label?: string; 
}) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 border rounded shadow">
        <p className="font-medium">{`${label}`}</p>
        {payload.map((item, index) => (
          <p key={index} className="text-sm">
            {`${item.name}: ${formatter(item.value as number)}`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// Format number as currency
const formatter = (value: number | ValueType): string => {
  if (typeof value === 'number') {
    return `$${value.toLocaleString()}`;
  } else if (typeof value === 'string') {
    const num = parseFloat(value);
    return isNaN(num) ? '$0' : `$${num.toLocaleString()}`;
  }
  return '$0';
};

// COLORS array for pie charts
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const AdminStatistics = () => {
  const { isAdmin } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [payments, setPayments] = useState<PaymentWithCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortField, setSortField] = useState<keyof Payment>('createdAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [successfulPaymentsStats, setSuccessfulPaymentsStats] = useState<PaymentStats | null>(null);
  const [monthlyRevenueStats, setMonthlyRevenueStats] = useState<MonthlyRevenue[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [coursesData, paymentsData, successfulStats, monthlyStats] = await Promise.all([
          getAllCourses(),
          getAllPayments(),
          getSuccessfulPaymentsStats(),
          getMonthlyRevenueStats()
        ]);
        setCourses(coursesData);
        setPayments(paymentsData);
        setSuccessfulPaymentsStats(successfulStats);
        setMonthlyRevenueStats(monthlyStats);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Calculate course statistics
  const courseStats = {
    totalVideos: courses.reduce((acc, course) => 
      acc + course.sections.reduce((sum, section) => sum + section.videos.length, 0), 0),
    averagePrice: courses.reduce((acc, course) => acc + course.price, 0) / (courses.length || 1),
    totalRevenue: payments.reduce((acc, payment) => 
      payment.status === 'completed' ? acc + payment.amount : acc, 0),
    coursesByLevel: courses.reduce((acc, course) => {
      acc[course.level] = (acc[course.level] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  };

  // Calculate payment statistics
  const paymentStats = {
    totalRevenue: payments.reduce((acc, payment) => 
      payment.status === 'completed' ? acc + payment.amount : acc, 0),
    totalTransactions: payments.length,
    successfulPayments: payments.filter(p => p.status.toLowerCase() === 'completed').length,
    failedPayments: payments.filter(p => p.status.toLowerCase() === 'failed').length,
    pendingPayments: payments.filter(p => p.status.toLowerCase() === 'pending').length,
    averageTransactionValue: payments.length > 0 
      ? payments.reduce((acc, payment) => acc + payment.amount, 0) / payments.length 
      : 0
  };

  // Prepare data for charts
  const coursesByLevelData = Object.entries(courseStats.coursesByLevel).map(([level, count]) => ({
    name: level,
    value: count
  }));

  const monthlyRevenueData = payments
    .filter(p => p.status === 'completed')
    .reduce((acc, payment) => {
      const month = new Date(payment.createdAt).toLocaleString('default', { month: 'short' });
      acc[month] = (acc[month] || 0) + payment.amount;
      return acc;
    }, {} as Record<string, number>);

  const monthlyRevenueChartData = monthlyRevenueStats;

  // Prepare data for payment status distribution chart
  const paymentStatusData = [
    { 
      name: 'Completed', 
      value: paymentStats.successfulPayments,
      color: '#00C49F'  // Green
    },
    { 
      name: 'Failed', 
      value: paymentStats.failedPayments,
      color: '#FF8042'  // Red
    },
    { 
      name: 'Pending', 
      value: paymentStats.pendingPayments,
      color: '#FFBB28'  // Yellow
    }
  ].filter(item => item.value > 0); // Only show statuses that have values

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

  const handlePrintInvoice = async (paymentId: string) => {
    try {
      const response = await downloadInvoice(paymentId);
      const blob = new Blob([response], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      
      // Create an iframe to load the PDF
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      document.body.appendChild(iframe);
      
      iframe.src = url;
      
      // Wait for the PDF to load
      iframe.onload = () => {
        iframe.contentWindow?.print();
        // Clean up after printing
        setTimeout(() => {
          document.body.removeChild(iframe);
          window.URL.revokeObjectURL(url);
        }, 1000);
      };
    } catch (error) {
      console.error('Error printing invoice:', error);
      toast.error('Failed to print invoice');
    }
  };

  const handleViewDetails = (paymentId: string) => {
    const payment = payments.find(p => p.id === paymentId);
    if (!payment) {
      toast.error('Payment details not found');
      return;
    }

    // Create a modal or dialog with payment details
    toast.info(
      <div className="space-y-2">
        <h3 className="font-bold">Payment Details</h3>
        <p>ID: {payment.id}</p>
        <p>Amount: {formatter(payment.amount)}</p>
        <p>Status: {payment.status}</p>
        <p>Date: {new Date(payment.createdAt).toLocaleString()}</p>
        {payment.course && (
          <p>Course: {payment.course.name}</p>
        )}
      </div>
    );
  };

  // Sort and filter payments
  const sortedAndFilteredPayments = payments
    .filter(payment => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = 
        payment.id.toLowerCase().includes(searchLower) ||
        payment.status.toLowerCase().includes(searchLower);
      
      const matchesStatus = statusFilter === '' || payment.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === 'asc' 
          ? aValue - bValue
          : bValue - aValue;
      }
      
      return 0;
    });

  // Calculate pagination
  const totalPages = Math.ceil(sortedAndFilteredPayments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedPayments = sortedAndFilteredPayments.slice(startIndex, startIndex + itemsPerPage);

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Handle sort
  const handleSort = (field: keyof Payment) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  return (
    <AdminLayout title="Dashboard Statistics">
      <div className="container py-10">
        
        
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatter(payments
                  .filter(payment => payment.status.toLowerCase() === 'completed')
                  .reduce((acc, payment) => acc + payment.amount, 0)
                )}
              </div>
              <div className="text-sm text-gray-500">
                {successfulPaymentsStats?.completed || 0} successful transactions
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Total Transactions</CardTitle>
              <FileText className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {(successfulPaymentsStats?.completed || 0) + 
                 (successfulPaymentsStats?.failed || 0) + 
                 (successfulPaymentsStats?.pending || 0)}
              </div>
              
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Success Rate</CardTitle>
              <GraduationCap className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              {(() => {
                const completed = successfulPaymentsStats?.completed || 0;
                const failed = successfulPaymentsStats?.failed || 0;
                const pending = successfulPaymentsStats?.pending || 0;
                const total = completed + failed + pending;
                const successRate = total > 0 ? ((completed / total) * 100).toFixed(1) : '0';
                
                return (
                  <>
                    <div className="text-2xl font-bold">{successRate}%</div>
                    <div className="text-sm text-gray-500">
                      {completed} successful / {total} total
                    </div>
                  </>
                );
              })()}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Pending Payments</CardTitle>
              <FileText className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{successfulPaymentsStats?.pending || 0}</div>
              <div className="text-sm text-gray-500">
                {successfulPaymentsStats?.failed || 0} failed transactions
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Revenue Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card className="col-span-2">
            <CardHeader>
              <CardTitle>Monthly Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={monthlyRevenueChartData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis tickFormatter={(value) => `$${value}`} />
                    <Tooltip content={<CustomTooltip />} />
                    <Line
                      type="monotone"
                      dataKey="revenue"
                      name="Revenue"
                      stroke="#8884d8"
                      strokeWidth={2}
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Course Distribution and Payment Status */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Courses by Level</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={coursesByLevelData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      fill="#8884d8"
                      paddingAngle={5}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {coursesByLevelData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Payment Status Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                {paymentStatusData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={paymentStatusData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        fill="#8884d8"
                        paddingAngle={5}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {paymentStatusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value: number) => [`${value} payments`, 'Count']}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-gray-500">
                    No payment data available
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Invoice Table Section */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Payment Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4 flex flex-col md:flex-row gap-4">
                <input
                  type="text"
                  placeholder="Search transactions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full md:w-64 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full md:w-48 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">All Statuses</option>
                  <option value="completed">Completed</option>
                  <option value="pending">Pending</option>
                  <option value="failed">Failed</option>
                </select>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th 
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                        onClick={() => handleSort('id')}
                      >
                        Transaction ID
                        {sortField === 'id' && (
                          <span className="ml-1">
                            {sortDirection === 'asc' ? '↑' : '↓'}
                          </span>
                        )}
                      </th>
                      <th 
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                        onClick={() => handleSort('amount')}
                      >
                        Amount
                        {sortField === 'amount' && (
                          <span className="ml-1">
                            {sortDirection === 'asc' ? '↑' : '↓'}
                          </span>
                        )}
                      </th>
                      <th 
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                        onClick={() => handleSort('status')}
                      >
                        Status
                        {sortField === 'status' && (
                          <span className="ml-1">
                            {sortDirection === 'asc' ? '↑' : '↓'}
                          </span>
                        )}
                      </th>
                      <th 
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                        onClick={() => handleSort('createdAt')}
                      >
                        Date
                        {sortField === 'createdAt' && (
                          <span className="ml-1">
                            {sortDirection === 'asc' ? '↑' : '↓'}
                          </span>
                        )}
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
                    ) : paginatedPayments.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                          No transactions found
                        </td>
                      </tr>
                    ) : (
                      paginatedPayments.map((payment) => (
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
                                      Download PDF
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

              {/* Pagination Controls */}
              {!loading && totalPages > 1 && (
                <div className="mt-4 flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, sortedAndFilteredPayments.length)} of {sortedAndFilteredPayments.length} entries
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => handlePageChange(page)}
                        className="w-8 h-8"
                      >
                        {page}
                      </Button>
                    ))}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminStatistics;
