import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { mockApiService } from '../services/mockData';

const MyCourses = ({ user }) => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) {
      fetchEnrolledCourses();
    }
  }, [user]);

  const fetchEnrolledCourses = async () => {
    try {
      const response = await mockApiService.getEnrolledCourses(user.id);
      if (response.success) {
        setCourses(response.data);
      } else {
        setError(response.error);
      }
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch enrolled courses');
      setLoading(false);
    }
  };

  if (loading) return <div>Loading your courses...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">My Courses</h1>
      
      {courses.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600 mb-4">You haven't enrolled in any courses yet.</p>
          <Link
            to="/courses"
            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
          >
            Browse Courses
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div key={course.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              {course.thumbnail && (
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-2">{course.title}</h3>
                <p className="text-gray-600 mb-4">{course.description}</p>
                
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <span className="text-sm text-gray-500">Progress</span>
                    <div className="w-32 h-2 bg-gray-200 rounded-full">
                      <div
                        className="h-full bg-blue-500 rounded-full"
                        style={{ width: `${course.progress}%` }}
                      ></div>
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">
                    {course.progress}% Complete
                  </span>
                </div>

                <Link
                  to={`/courses/${course.id}`}
                  className="block text-center bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
                >
                  Continue Learning
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyCourses; 