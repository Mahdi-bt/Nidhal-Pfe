import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllCourses } from '@/lib/api';
import { Course } from '@/lib/api';
import { toast } from '@/components/ui/sonner';
const getFileUrl = (path: string) => {
  if (!path) return '/placeholder-image.jpg';
  return `http://localhost:3000/${path}`;
};
const FeaturedCourses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await getAllCourses();
        // Sort courses by enrolledStudents to get the most popular ones
        const sortedCourses = data.sort((a, b) => b.enrolledStudents - a.enrolledStudents);
        // Take only the top 3 courses
        setCourses(sortedCourses.slice(0, 3));
      } catch (error) {
        console.error('Error fetching courses:', error);
        toast.error('Failed to fetch courses');
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (loading) {
    return (
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Featured Courses</h2>
            <Link to="/courses" className="text-primary hover:underline">View All</Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="card h-full flex flex-col animate-pulse">
                <div className="bg-gray-200 h-48 rounded-t-lg"></div>
                <div className="p-4 flex-grow">
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (courses.length === 0) {
    return null;
  }

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Featured Courses</h2>
          <Link to="/courses" className="text-primary hover:underline">View All</Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {courses.map((course) => (
            <div key={course.id} className="card h-full flex flex-col">
              <div className="relative">
                <img 
                  src={getFileUrl(course.thumbnail)} 
                  alt={course.name} 
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                <div className="absolute top-2 right-2">
                  <span className={`badge ${
                    course.level === 'BEGINNER' ? 'badge-success' :
                    course.level === 'INTERMEDIATE' ? 'badge-info' :
                    'badge-warning'
                  }`}>
                    {course.level}
                  </span>
                </div>
              </div>
              <div className="p-4 flex-grow flex flex-col">
                <h3 className="font-bold text-lg mb-2">{course.name}</h3>
                <p className="text-gray-600 text-sm mb-4 flex-grow line-clamp-2">
                  {course.description}
                </p>
                <div className="flex items-center justify-between mt-auto">
                  <div className="flex items-center space-x-2 text-sm">
                    <span>{course.duration} weeks</span>
                    <span>•</span>
                    <span>{course.enrolledStudents} students</span>
                  </div>
                  <div className="text-lg font-bold text-primary">
                    ${course.price}
                  </div>
                </div>
              </div>
              <div className="px-4 pb-4">
                <Link 
                  to={`/courses/${course.id}`}
                  className="btn-primary block text-center"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedCourses; 