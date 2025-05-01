import React from 'react';
import { Link } from 'react-router-dom';
import { Course } from '@/lib/api';

interface CourseCardProps {
  course: Course;
}
const getFileUrl = (path: string) => {
  if (!path) return '/placeholder-image.jpg';
  return `http://localhost:3000/${path}`;
};
const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  return (
    <div className="card h-full flex flex-col">
      <div className="relative">
        <img 
          src={getFileUrl(course.thumbnail)} 
          alt={course.name} 
          className="w-full h-48 object-cover rounded-t-lg"
        />
        <div className="absolute top-2 right-2">
          <span className={`
            badge 
            ${course.level === 'BEGINNER' ? 'badge-success' : ''}
            ${course.level === 'INTERMEDIATE' ? 'badge-info' : ''}
            ${course.level === 'ADVANCED' ? 'badge-danger' : ''}
          `}>
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
          <div className="text-lg font-bold text-primary">${course.price}</div>
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
  );
};

export default CourseCard;
