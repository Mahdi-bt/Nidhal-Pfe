
import React from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '@/components/Layout/MainLayout';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

const Index = () => {
  const { isAuthenticated } = useAuth();

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="bg-primary">
        <div className="container mx-auto px-4 py-16 md:py-24 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 text-white">
            <h1 className="text-3xl md:text-5xl font-bold mb-4">
              Advance Your Career with Expert-Led Training
            </h1>
            <p className="text-lg md:text-xl mb-8 text-white/80">
              Join our online training center to learn in-demand skills from industry experts.
              Progress at your own pace with interactive courses and hands-on projects.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" asChild className="bg-white text-primary hover:bg-white/90">
                <Link to="/courses">Explore Courses</Link>
              </Button>
              {!isAuthenticated && (
                <Button size="lg" variant="outline" asChild className="border-white text-white hover:bg-white/10">
                  <Link to="/register">Sign Up Free</Link>
                </Button>
              )}
            </div>
          </div>
          <div className="md:w-1/2 mt-12 md:mt-0">
            <img 
              src="/lovable-uploads/07f85ded-6088-42d7-a114-463c0fc0d3b9.png" 
              alt="Training Center" 
              className="rounded-lg shadow-xl"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Our Training Center</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="bg-primary/10 w-12 h-12 flex items-center justify-center rounded-full mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                  <path d="M12 20h9"/>
                  <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Expert Instructors</h3>
              <p className="text-gray-600">
                Learn from industry professionals with years of experience in their fields.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="bg-primary/10 w-12 h-12 flex items-center justify-center rounded-full mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                  <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
                  <line x1="8" y1="21" x2="16" y2="21"/>
                  <line x1="12" y1="17" x2="12" y2="21"/>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Flexible Learning</h3>
              <p className="text-gray-600">
                Study at your own pace with 24/7 access to course materials from any device.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="bg-primary/10 w-12 h-12 flex items-center justify-center rounded-full mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Hands-on Projects</h3>
              <p className="text-gray-600">
                Apply your knowledge with practical projects that build your portfolio.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Featured Courses</h2>
            <Link to="/courses" className="text-primary hover:underline">View All</Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card h-full flex flex-col">
              <div className="relative">
                <img 
                  src="/lovable-uploads/4fc38c23-4919-4cc2-a98e-b334f3f7a6b5.png" 
                  alt="Web Development Bootcamp" 
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                <div className="absolute top-2 right-2">
                  <span className="badge badge-success">
                    Beginner
                  </span>
                </div>
              </div>
              <div className="p-4 flex-grow flex flex-col">
                <h3 className="font-bold text-lg mb-2">Web Development Bootcamp</h3>
                <p className="text-gray-600 text-sm mb-4 flex-grow line-clamp-2">
                  Learn modern web development from scratch. Master HTML, CSS, JavaScript, and popular frameworks.
                </p>
                <div className="flex items-center justify-between mt-auto">
                  <div className="flex items-center space-x-2 text-sm">
                    <span>12 weeks</span>
                    <span>•</span>
                    <span>15 students</span>
                  </div>
                  <div className="text-lg font-bold text-primary">$299</div>
                </div>
              </div>
              <div className="px-4 pb-4">
                <Link 
                  to="/courses/1" 
                  className="btn-primary block text-center"
                >
                  View Details
                </Link>
              </div>
            </div>
            
            <div className="card h-full flex flex-col">
              <div className="relative">
                <img 
                  src="/lovable-uploads/3f4d9c1e-1c23-4ea0-8d0f-3c3acb82eb5b.png" 
                  alt="Data Science Fundamentals" 
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                <div className="absolute top-2 right-2">
                  <span className="badge badge-info">
                    Intermediate
                  </span>
                </div>
              </div>
              <div className="p-4 flex-grow flex flex-col">
                <h3 className="font-bold text-lg mb-2">Data Science Fundamentals</h3>
                <p className="text-gray-600 text-sm mb-4 flex-grow line-clamp-2">
                  Master the fundamentals of data science, including Python, statistics, and machine learning.
                </p>
                <div className="flex items-center justify-between mt-auto">
                  <div className="flex items-center space-x-2 text-sm">
                    <span>16 weeks</span>
                    <span>•</span>
                    <span>12 students</span>
                  </div>
                  <div className="text-lg font-bold text-primary">$399</div>
                </div>
              </div>
              <div className="px-4 pb-4">
                <Link 
                  to="/courses/2" 
                  className="btn-primary block text-center"
                >
                  View Details
                </Link>
              </div>
            </div>
            
            <div className="card h-full flex flex-col">
              <div className="relative">
                <img 
                  src="/lovable-uploads/bdef662c-03a7-45cc-819f-3c6650818c7c.png" 
                  alt="Mobile App Development" 
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                <div className="absolute top-2 right-2">
                  <span className="badge badge-info">
                    Intermediate
                  </span>
                </div>
              </div>
              <div className="p-4 flex-grow flex flex-col">
                <h3 className="font-bold text-lg mb-2">Mobile App Development</h3>
                <p className="text-gray-600 text-sm mb-4 flex-grow line-clamp-2">
                  Learn to build native mobile applications for iOS and Android using React Native.
                </p>
                <div className="flex items-center justify-between mt-auto">
                  <div className="flex items-center space-x-2 text-sm">
                    <span>14 weeks</span>
                    <span>•</span>
                    <span>8 students</span>
                  </div>
                  <div className="text-lg font-bold text-primary">$349</div>
                </div>
              </div>
              <div className="px-4 pb-4">
                <Link 
                  to="/courses/3" 
                  className="btn-primary block text-center"
                >
                  View Details
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">What Our Students Say</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center text-lg font-bold text-gray-600">
                  MJ
                </div>
                <div className="ml-4">
                  <h4 className="font-bold">Michael Johnson</h4>
                  <p className="text-sm text-gray-500">Web Developer</p>
                </div>
              </div>
              <p className="text-gray-600">
                "The Web Development Bootcamp completely transformed my career. I went from knowing almost nothing about coding to landing my dream job as a front-end developer in just six months."
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center text-lg font-bold text-gray-600">
                  SA
                </div>
                <div className="ml-4">
                  <h4 className="font-bold">Sarah Adams</h4>
                  <p className="text-sm text-gray-500">Data Analyst</p>
                </div>
              </div>
              <p className="text-gray-600">
                "The Data Science course provided me with practical skills that I immediately applied in my job. The instructors were knowledgeable and the community support was incredible."
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center text-lg font-bold text-gray-600">
                  RK
                </div>
                <div className="ml-4">
                  <h4 className="font-bold">Robert Kim</h4>
                  <p className="text-sm text-gray-500">Mobile Developer</p>
                </div>
              </div>
              <p className="text-gray-600">
                "After completing the Mobile App Development course, I was able to create and publish my first app within weeks. The step-by-step approach and real-world projects were invaluable."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Start Your Learning Journey?</h2>
          <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
            Join thousands of students who have advanced their careers through our training programs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild className="bg-white text-primary hover:bg-white/90">
              <Link to="/courses">Browse Courses</Link>
            </Button>
            {!isAuthenticated && (
              <Button size="lg" variant="outline" asChild className="border-white text-white hover:bg-white/10">
                <Link to="/register">Create Account</Link>
              </Button>
            )}
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default Index;
