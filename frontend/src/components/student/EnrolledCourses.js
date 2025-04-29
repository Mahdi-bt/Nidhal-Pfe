import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const EnrolledCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchEnrolledCourses();
  }, []);

  const fetchEnrolledCourses = async () => {
    try {
      const response = await axios.get('/api/courses/user/enrolled');
      setCourses(response.data.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch enrolled courses');
      setLoading(false);
    }
  };

  const handleProgressUpdate = async (courseId, newProgress) => {
    try {
      await axios.patch(`/api/courses/${courseId}/progress`, { progress: newProgress });
      fetchEnrolledCourses(); // Refresh the list
    } catch (err) {
      setError('Failed to update progress');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">My Courses</h1>

      {courses.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 mb-4">You haven't enrolled in any courses yet.</p>
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
                <h2 className="text-xl font-semibold mb-2">{course.title}</h2>
                <p className="text-gray-600 mb-4 line-clamp-2">{course.description}</p>
                
                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-gray-700">Progress</span>
                    <span className="text-sm font-medium text-gray-700">{course.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-blue-600 h-2.5 rounded-full"
                      style={{ width: `${course.progress}%` }}
                    ></div>
                  </div>
                </div>

                {/* Progress Controls */}
                <div className="flex items-center space-x-2 mb-4">
                  <button
                    onClick={() => handleProgressUpdate(course.id, Math.max(0, course.progress - 10))}
                    className="bg-gray-200 text-gray-700 px-3 py-1 rounded hover:bg-gray-300"
                  >
                    -10%
                  </button>
                  <button
                    onClick={() => handleProgressUpdate(course.id, Math.min(100, course.progress + 10))}
                    className="bg-gray-200 text-gray-700 px-3 py-1 rounded hover:bg-gray-300"
                  >
                    +10%
                  </button>
                </div>

                <div className="flex justify-between items-center">
                  <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700">
                    {course.level}
                  </span>
                  <Link
                    to={`/courses/${course.id}`}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    Continue Learning
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EnrolledCourses; 