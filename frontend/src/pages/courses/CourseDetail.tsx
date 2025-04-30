import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getCourseById, enrollInCourse, Course } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import MainLayout from '@/components/Layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/ui/sonner';
import { CheckCircle, Clock, Users, PlayCircle } from 'lucide-react';

const CourseDetail = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [enrolling, setEnrolling] = useState(false);

  const { data: course, isLoading, error } = useQuery({
    queryKey: ['course', courseId],
    queryFn: () => getCourseById(courseId || ''),
    enabled: !!courseId,
  });

  const handleEnroll = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to enroll in this course');
      navigate('/login');
      return;
    }

    try {
      setEnrolling(true);
      await enrollInCourse(courseId || '');
      toast.success('Successfully enrolled in course');
      navigate('/my-courses');
    } catch (error) {
      console.error('Error enrolling in course:', error);
      toast.error('Failed to enroll in course');
    } finally {
      setEnrolling(false);
    }
  };

  if (isLoading) {
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

  if (error || !course) {
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
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {section.videos.map((video) => (
                            <li key={video.id} className="flex items-center p-2 hover:bg-gray-50 rounded">
                              <PlayCircle className="h-5 w-5 mr-3 text-primary" />
                              <div className="flex flex-grow justify-between">
                                <span>{video.name}</span>
                                <span className="text-gray-500">
                                  {Math.floor(video.duration / 60)}:{(video.duration % 60).toString().padStart(2, '0')}
                                </span>
                              </div>
                            </li>
                          ))}
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
                <Button 
                  className="w-full" 
                  size="lg"
                  onClick={handleEnroll}
                  disabled={enrolling}
                >
                  {enrolling ? 'Enrolling...' : 'Enroll Now'}
                </Button>
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
      </div>
    </MainLayout>
  );
};

export default CourseDetail;
