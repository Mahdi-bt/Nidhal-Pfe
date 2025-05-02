import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getCourseById, createPaymentIntent, confirmPayment, Course, getEnrolledCourses } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import MainLayout from '@/components/Layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { toast } from '@/components/ui/sonner';
import { CheckCircle, Clock, Users, PlayCircle, BookOpen, Award } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Label } from '@/components/ui/label';

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
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) {
      console.error('Stripe or Elements not initialized:', { stripe, elements });
      return;
    }

    setProcessing(true);
    setError(null);

    try {
      console.log('Starting payment confirmation...');
      const { error: submitError, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/courses/${courseId}/success`,
        },
        redirect: 'if_required',
      });

      console.log('Stripe payment result:', { submitError, paymentIntent });

      if (submitError) {
        console.error('Stripe payment error:', submitError);
        if (submitError.type === 'card_error' || submitError.type === 'validation_error') {
          toast.error(submitError.message);
        } else {
          toast.error('An unexpected error occurred.');
        }
        setError(submitError.message || 'An error occurred');
        return;
      }

      if (!paymentIntent) {
        console.error('No payment intent returned from Stripe');
        throw new Error('Payment confirmation failed');
      }

      console.log('Payment successful with Stripe, confirming with backend...');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/payments/confirm/${paymentIntent.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      console.log('Backend response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Backend confirmation failed:', {
          status: response.status,
          statusText: response.statusText,
          error: errorText
        });
        throw new Error(errorText || 'Failed to confirm payment');
      }

      let data;
      try {
        data = await response.json();
        console.log('Backend confirmation response:', data);
      } catch (parseError) {
        console.error('Failed to parse response:', parseError);
        throw new Error('Invalid response from server');
      }

      toast.success('Payment successful!');
      navigate(`/my-courses`);
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
  );
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

  if (courseLoading || enrolledLoading) {
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
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Course Details */}
          <div className="lg:col-span-2">
            <h1 className="text-3xl font-bold mb-4">{course.name}</h1>
            <p className="text-gray-600 mb-6">{course.description}</p>
            
            <div className="flex flex-wrap gap-4 mb-8">
              <div className="flex items-center">
                <Clock className="h-5 w-5 mr-2 text-gray-500" />
                <span>{course.duration} weeks</span>
              </div>
              <div className="flex items-center">
                <Users className="h-5 w-5 mr-2 text-gray-500" />
                <span>{course.enrolledStudents} students</span>
              </div>
              <Badge variant="outline" className="ml-2">
                {course.level}
              </Badge>
              <Badge variant="outline" className="ml-2">
                {course.category}
              </Badge>
            </div>

            {/* Progress Section for Enrolled Users */}
            {isEnrolled && courseProgress && (
              <div className="mb-8 p-4 bg-white rounded-lg shadow-sm border">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold">Your Progress</h3>
                  <Badge variant={courseProgress.completed ? "default" : "outline"}>
                    {courseProgress.completed ? "Completed" : "In Progress"}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Overall Progress</span>
                    <span>{Math.round(courseProgress.overall * 100)}%</span>
                  </div>
                  <Progress value={courseProgress.overall * 100} className="h-2" />
                </div>
                {courseProgress.sections && (
                  <div className="mt-4 space-y-3">
                    {courseProgress.sections.map((section) => (
                      <div key={section.id} className="space-y-1">
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
            )}

            <Tabs defaultValue="content">
              <TabsList className="mb-6">
                <TabsTrigger value="content">Course Content</TabsTrigger>
                <TabsTrigger value="requirements">Requirements</TabsTrigger>
                <TabsTrigger value="instructor">Instructor</TabsTrigger>
              </TabsList>
              
              <TabsContent value="content">
                <div className="space-y-4">
                  {course.sections.map((section, index) => (
                    <Card key={section.id}>
                      <CardHeader>
                        <CardTitle className="text-xl">
                          Section {index + 1}: {section.name}
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
                                className={`flex items-center p-2 hover:bg-gray-50 rounded cursor-pointer ${
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
                                <div className="flex flex-grow justify-between">
                                  <span>{video.name}</span>
                                  <div className="flex items-center space-x-2">
                                    {videoProgress && (
                                      <span className="text-sm text-gray-500">
                                        {Math.round(videoProgress.progress * 100)}%
                                      </span>
                                    )}
                                    <span className="text-gray-500">
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
                <Card>
                  <CardContent className="pt-6">
                    <ul className="list-disc pl-5 space-y-2">
                      <li>Basic computer knowledge</li>
                      <li>No prior experience needed for {course.level} level courses</li>
                      <li>Reliable internet connection</li>
                      <li>Commitment to learning</li>
                    </ul>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="instructor">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center mb-4">
                      <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center mr-4">
                        <span className="text-lg font-bold">JS</span>
                      </div>
                      <div>
                        <h3 className="font-bold">John Smith</h3>
                        <p className="text-sm text-gray-500">Professional Instructor</p>
                      </div>
                    </div>
                    <p>
                      John Smith is an expert instructor with over 10 years of experience in the field. 
                      He has helped thousands of students master complex topics through his clear and 
                      engaging teaching style.
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
          
          {/* Enrollment Card */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-primary">${course.price}</CardTitle>
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
            <div className="mt-8">
              <h3 className="text-xl font-bold mb-4">Related Courses</h3>
              {/* We'll display similar courses in the same category */}
              <div className="space-y-4">
                {/* Note: We should fetch related courses here, not use 'courses' variable */}
                {/* For now, we'll show a placeholder */}
                <Card>
                  <CardContent className="p-4">
                    <p className="text-center text-gray-500">
                      Related courses will appear here
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Dialog */}
        <Dialog 
          open={showPaymentDialog} 
          onOpenChange={(open) => {
            console.log('Dialog open state changing:', open);
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
