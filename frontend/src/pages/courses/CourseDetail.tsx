import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getCourseById, createPaymentIntent, confirmPayment, Course, getEnrolledCourses, getAllCourses, getMyTransactions, downloadInvoice } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import MainLayout from '@/components/Layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { toast } from '@/components/ui/sonner';
import { CheckCircle, Clock, Users, PlayCircle, BookOpen, Award, Star, ChevronRight, ArrowRight, FileText, Download } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Label } from '@/components/ui/label';
import { motion } from 'framer-motion';

const STRIPE_OPTIONS = {
  style: {
    base: {
      fontSize: '16px',
      color: '#32325d',
      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
      fontSmoothing: 'antialiased',
      '::placeholder': {
        color: '#aab7c4'
      },
      backgroundColor: 'white',
    },
    invalid: {
      color: '#fa755a',
      iconColor: '#fa755a'
    }
  }
};

interface PaymentIntent {
  id: string;
  clientSecret: string;
  amount: number;
  status: 'pending' | 'succeeded' | 'failed';
}

interface PaymentFormProps {
  clientSecret: string;
  courseId: string;
}

const PaymentForm = ({ clientSecret, courseId }: PaymentFormProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [successPaymentId, setSuccessPaymentId] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleDownloadInvoice = async () => {
    if (!successPaymentId) return;
    
    try {
      const blob = await downloadInvoice(successPaymentId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `invoice-${successPaymentId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      toast.error('Failed to download invoice');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) {
      console.error('Stripe or Elements not initialized:', { stripe, elements });
      return;
    }

    setProcessing(true);
    setError(null);

    try {
      const { error: submitError, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/courses/${courseId}/success`,
        },
        redirect: 'if_required',
      });

      if (submitError) {
        if (submitError.type === 'card_error' || submitError.type === 'validation_error') {
          toast.error(submitError.message);
        } else {
          toast.error('An unexpected error occurred.');
        }
        setError(submitError.message || 'An error occurred');
        return;
      }

      if (!paymentIntent) {
        throw new Error('Payment confirmation failed');
      }

      const response = await fetch(`${import.meta.env.VITE_API_URL}/payments/confirm/${paymentIntent.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to confirm payment');
      }

      const data = await response.json();
      setSuccessPaymentId(paymentIntent.id);
      setShowSuccessDialog(true);
      toast.success('Payment successful!');
    } catch (err: unknown) {
      console.error('Payment processing error:', err);
      const errorMessage = err instanceof Error ? err.message : 'An error occurred during payment';
      toast.error(errorMessage);
      setError(errorMessage);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto">
        <div className="mb-6 max-h-[400px] overflow-y-auto">
          <PaymentElement 
            options={{
              layout: 'tabs',
              defaultValues: {
                billingDetails: {
                  name: 'Test User',
                  email: 'test@example.com'
                }
              }
            }}
          />
        </div>
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}
        <button
          type="submit"
          disabled={!stripe || processing}
          className={`w-full py-2 px-4 rounded ${
            processing ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
          } text-white font-medium`}
        >
          {processing ? 'Processing...' : 'Pay Now'}
        </button>
      </form>

      {/* Success Dialog */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle className="h-6 w-6 text-green-500" />
              Payment Successful!
            </DialogTitle>
            <DialogDescription>
              Your payment has been processed successfully. You can now access the course and download your invoice.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-gray-500" />
                  <span className="text-sm text-gray-600">Invoice</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDownloadInvoice}
                  className="flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  Download
                </Button>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={() => {
                setShowSuccessDialog(false);
                navigate('/my-courses');
              }}
              className="w-full"
            >
              Go to My Courses
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

const getFileUrl = (path: string) => {
  if (!path) return '/placeholder-image.jpg';
  return `http://localhost:3000/${path}`;
};

const CourseDetail = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [enrolling, setEnrolling] = useState(false);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [paymentIntent, setPaymentIntent] = useState<PaymentIntent | null>(null);
  const [stripePromise] = useState(() => loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY));

  const { data: course, isLoading: courseLoading } = useQuery({
    queryKey: ['course', courseId],
    queryFn: () => getCourseById(courseId || ''),
    enabled: !!courseId,
  });

  const { data: enrolledCourses, isLoading: enrolledLoading } = useQuery({
    queryKey: ['enrolledCourses'],
    queryFn: () => getEnrolledCourses(user?.id || ''),
    enabled: !!user?.id,
  });

  const { data: allCourses, isLoading: coursesLoading } = useQuery({
    queryKey: ['allCourses'],
    queryFn: () => getAllCourses(),
  });

  // Filter related courses locally
  const relatedCourses = allCourses?.filter(c => 
    c.category === course?.category && c.id !== courseId
  ).slice(0, 3);

  const isEnrolled = enrolledCourses?.some(course => course.id === courseId);

  // Get course progress for enrolled users
  const courseProgress = enrolledCourses?.find(course => course.id === courseId)?.progress;

  // Find the last watched video or first unwatched video
  const findLastWatchedVideo = () => {
    if (!courseProgress || !course) return null;

    // First try to find a video in progress
    for (const section of courseProgress.sections) {
      const inProgressVideo = section.videoProgress.find(vp => 
        vp.progress > 0 && vp.progress < 90 && !vp.watched
      );
      if (inProgressVideo) {
        const courseSection = course.sections.find(s => s.id === section.id);
        const video = courseSection?.videos.find(v => v.id === inProgressVideo.videoId);
        if (video) {
          return { section: courseSection, video };
        }
      }
    }

    // If no in-progress video, find the first unwatched video
    for (const section of courseProgress.sections) {
      const unwatchedVideo = section.videoProgress.find(vp => !vp.watched);
      if (unwatchedVideo) {
        const courseSection = course.sections.find(s => s.id === section.id);
        const video = courseSection?.videos.find(v => v.id === unwatchedVideo.videoId);
        if (video) {
          return { section: courseSection, video };
        }
      }
    }

    // If all videos are watched, return the first video for review
    const firstSection = course.sections[0];
    const firstVideo = firstSection?.videos[0];
    return firstVideo ? { section: firstSection, video: firstVideo } : null;
  };

  const handleEnroll = async () => {
    if (!isAuthenticated || !user) {
      toast.error('Please login to enroll in this course');
      navigate('/login');
      return;
    }

    try {
      setEnrolling(true);
      console.log('Starting enrollment process...', {
        courseId,
        userId: user.id,
        isAuthenticated,
        user
      });
      
      const response = await createPaymentIntent(courseId || '', user.id);
      console.log('Payment intent response:', response);
      
      if (!response.clientSecret) {
        console.error('No client secret in response:', response);
        throw new Error('No client secret received from server');
      }

      console.log('Setting payment intent state...');
      setPaymentIntent({ 
        id: response.paymentIntentId || courseId || '', 
        clientSecret: response.clientSecret, 
        amount: response.amount || course?.price || 0, 
        status: 'pending' 
      });
      
      console.log('Opening payment dialog...');
      setShowPaymentDialog(true);
    } catch (error) {
      console.error('Error in handleEnroll:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to process payment');
      setShowPaymentDialog(false);
    } finally {
      setEnrolling(false);
    }
  };

  const handleStartLearning = () => {
    const lastWatched = findLastWatchedVideo();
    if (lastWatched) {
      navigate(`/courses/${courseId}/learn`, {
        state: {
          sectionId: lastWatched.section.id,
          videoId: lastWatched.video.id
        }
      });
    } else {
      navigate(`/courses/${courseId}/learn`);
    }
  };

  if (courseLoading || enrolledLoading || coursesLoading) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-12">
          <div className="flex justify-center">
            <p>Loading course details...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!course) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-12">
          <div className="flex justify-center">
            <p>Error loading course. Please try again later.</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        {/* Hero Section */}
        <div className="relative bg-gradient-to-r from-primary/10 to-primary/5 py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
                  {course.name}
                </h1>
                <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                  {course.description}
                </p>
                <div className="flex flex-wrap gap-4 mb-8">
                  <div className="flex items-center bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm">
                    <Clock className="h-5 w-5 mr-2 text-primary" />
                    <span className="font-medium">{course.duration} weeks</span>
                  </div>
                  <div className="flex items-center bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm">
                    <Users className="h-5 w-5 mr-2 text-primary" />
                    <span className="font-medium">{course.enrolledStudents} students</span>
                  </div>
                  <Badge variant="secondary" className="px-4 py-2 text-sm">
                    {course.level}
                  </Badge>
                  <Badge variant="secondary" className="px-4 py-2 text-sm">
                    {course.category}
                  </Badge>
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="relative"
              >
                <div className="aspect-video rounded-2xl overflow-hidden shadow-2xl">
                  <img
                    src={getFileUrl(course.thumbnail)}
                    alt={course.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                
              </motion.div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Progress Section for Enrolled Users */}
              {isEnrolled && courseProgress && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold">Your Progress</h3>
                    <Badge variant={courseProgress.completed ? "default" : "outline"}>
                      {courseProgress.completed ? "Completed" : "In Progress"}
                    </Badge>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm text-gray-600 mb-2">
                        <span>Overall Progress</span>
                        <span>{Math.round(courseProgress.overall * 100)}%</span>
                      </div>
                      <Progress value={courseProgress.overall * 100} className="h-2" />
                    </div>
                    {courseProgress.sections && (
                      <div className="space-y-4">
                        {courseProgress.sections.map((section) => (
                          <div key={section.id} className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="font-medium">{section.name}</span>
                              <span className="text-gray-600">{Math.round(section.progress * 100)}%</span>
                            </div>
                            <Progress value={section.progress * 100} className="h-1.5" />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              <Tabs defaultValue="content" className="bg-white rounded-2xl shadow-lg p-6">
                <TabsList className="mb-6 bg-gray-50 p-1 rounded-lg">
                  <TabsTrigger value="content" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
                    Course Content
                  </TabsTrigger>
                  
                </TabsList>
                
                <TabsContent value="content">
                  <div className="space-y-4">
                    {course.sections.map((section, index) => (
                      <Card key={section.id} className="border border-gray-100 hover:border-primary/20 transition-colors">
                        <CardHeader>
                          <CardTitle className="text-xl flex items-center">
                            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary mr-3">
                              {index + 1}
                            </span>
                            {section.name}
                          </CardTitle>
                          <CardDescription>
                            {section.videos.length} videos
                            {courseProgress && (
                              <span className="ml-2">
                                • {Math.round((courseProgress.sections.find(s => s.id === section.id)?.progress || 0) * 100)}% Complete
                              </span>
                            )}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-2">
                            {section.videos.map((video) => {
                              const videoProgress = courseProgress?.sections
                                .find(s => s.id === section.id)
                                ?.videoProgress.find(vp => vp.videoId === video.id);

                              return (
                                <li 
                                  key={video.id} 
                                  className={`flex items-center p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors ${
                                    isEnrolled ? 'hover:bg-primary/5' : ''
                                  }`}
                                  onClick={() => {
                                    if (isEnrolled) {
                                      navigate(`/courses/${courseId}/learn`, {
                                        state: {
                                          sectionId: section.id,
                                          videoId: video.id
                                        }
                                      });
                                    }
                                  }}
                                >
                                  <PlayCircle className={`h-5 w-5 mr-3 ${
                                    videoProgress?.watched ? 'text-green-500' :
                                    videoProgress?.progress ? 'text-primary' :
                                    'text-gray-400'
                                  }`} />
                                  <div className="flex flex-grow justify-between items-center">
                                    <span className="font-medium">{video.name}</span>
                                    <div className="flex items-center space-x-4">
                                      {videoProgress && (
                                        <span className="text-sm text-gray-500">
                                          {Math.round(videoProgress.progress * 100)}%
                                        </span>
                                      )}
                                      <span className="text-sm text-gray-500 flex items-center">
                                        <Clock className="h-4 w-4 mr-1" />
                                        {Math.floor(video.duration / 60)}:{(video.duration % 60).toString().padStart(2, '0')}
                                      </span>
                                    </div>
                                  </div>
                                </li>
                              );
                            })}
                          </ul>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="requirements">
                  <Card className="border-0 shadow-none">
                    <CardContent className="pt-6">
                      <ul className="space-y-4">
                        <li className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-1" />
                          <span>Basic computer knowledge</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-1" />
                          <span>No prior experience needed for {course.level} level courses</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-1" />
                          <span>Reliable internet connection</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-1" />
                          <span>Commitment to learning</span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="instructor">
                  <Card className="border-0 shadow-none">
                    <CardContent className="pt-6">
                      <div className="flex items-center mb-6">
                        <div className="h-16 w-16 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center mr-4">
                          <span className="text-xl font-bold text-white">JS</span>
                        </div>
                        <div>
                          <h3 className="text-xl font-bold">John Smith</h3>
                          <p className="text-gray-500">Professional Instructor</p>
                        </div>
                      </div>
                      <p className="text-gray-600 leading-relaxed">
                        John Smith is an expert instructor with over 10 years of experience in the field. 
                        He has helped thousands of students master complex topics through his clear and 
                        engaging teaching style.
                      </p>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
            
            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-8">
              {/* Enrollment Card */}
              <Card className="sticky top-24 border border-gray-100 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-3xl font-bold text-primary">${course.price}</CardTitle>
                  {isEnrolled && courseProgress && (
                    <div className="mt-2">
                      <div className="flex items-center text-sm text-gray-600">
                        <Award className="h-4 w-4 mr-1" />
                        <span>Your Progress: {Math.round(courseProgress.overall * 100)}%</span>
                      </div>
                    </div>
                  )}
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
                    <span>Full lifetime access</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
                    <span>Access on mobile and TV</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
                    <span>Certificate of completion</span>
                  </div>
                </CardContent>
                <CardFooter>
                  {isEnrolled ? (
                    <Button 
                      className="w-full" 
                      size="lg"
                      onClick={handleStartLearning}
                    >
                      <BookOpen className="mr-2 h-5 w-5" />
                      {courseProgress?.completed ? 'Review Course' : 'Continue Learning'}
                    </Button>
                  ) : (
                    <Button 
                      className="w-full" 
                      size="lg"
                      onClick={handleEnroll}
                      disabled={enrolling}
                    >
                      {enrolling ? 'Enrolling...' : 'Enroll Now'}
                    </Button>
                  )}
                </CardFooter>
              </Card>

              {/* Related courses section */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-xl font-bold mb-6">Related Courses</h3>
                {coursesLoading ? (
                  <div className="text-center py-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-2 text-sm text-gray-500">Loading related courses...</p>
                  </div>
                ) : relatedCourses && relatedCourses.length > 0 ? (
                  <div className="space-y-4">
                    {relatedCourses.map(relatedCourse => (
                      <Card 
                        key={relatedCourse.id}
                        className="border border-gray-100 hover:border-primary/20 transition-colors cursor-pointer"
                        onClick={() => navigate(`/courses/${relatedCourse.id}`)}
                      >
                        <CardHeader className="p-4">
                          <CardTitle className="text-lg line-clamp-1">{relatedCourse.name}</CardTitle>
                          <CardDescription className="line-clamp-2">
                            {relatedCourse.description}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <Clock className="h-4 w-4 text-gray-500" />
                              <span className="text-sm text-gray-500">{relatedCourse.duration} weeks</span>
                            </div>
                            <Badge variant="outline">{relatedCourse.level}</Badge>
                          </div>
                        </CardContent>
                        <CardFooter className="p-4 pt-0">
                          <div className="w-full flex justify-between items-center">
                            <span className="font-bold text-primary">${relatedCourse.price}</span>
                            <Button variant="ghost" size="sm" className="group">
                              View Course
                              <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                            </Button>
                          </div>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-gray-500">No related courses found</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Payment Dialog */}
        <Dialog 
          open={showPaymentDialog} 
          onOpenChange={(open) => {
            if (!open) {
              setPaymentIntent(null);
            }
            setShowPaymentDialog(open);
          }}
        >
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Complete Your Enrollment</DialogTitle>
              <DialogDescription>
                Please enter your card details to enroll in this course.
              </DialogDescription>
            </DialogHeader>
            {paymentIntent?.clientSecret ? (
              <Elements 
                stripe={stripePromise} 
                options={{
                  clientSecret: paymentIntent.clientSecret,
                  appearance: {
                    theme: 'stripe',
                    variables: {
                      colorPrimary: '#0ea5e9',
                      colorBackground: '#ffffff',
                      colorText: '#32325d',
                      colorDanger: '#df1b41',
                      fontFamily: 'system-ui, sans-serif',
                      spacingUnit: '4px',
                      borderRadius: '4px'
                    }
                  }
                }}
              >
                <PaymentForm clientSecret={paymentIntent.clientSecret} courseId={courseId || ''} />
              </Elements>
            ) : (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mx-auto"></div>
                <p className="mt-2 text-sm text-gray-500">
                  {enrolling ? 'Creating payment session...' : 'Loading payment form...'}
                </p>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
};

export default CourseDetail;
