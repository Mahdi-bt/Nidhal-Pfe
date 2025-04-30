
import React from 'react';
import { Link } from 'react-router-dom';
import { Course } from '@/lib/api';
import { Progress } from '@/components/ui/progress';

interface CourseProgressProps {
  course: Course & { progress: number };
}

const CourseProgress: React.FC<CourseProgressProps> = ({ course }) => {
  return (
    <div className="card h-full flex flex-col">
      <div className="relative">
        <img 
          src={course.thumbnail} 
          alt={course.name} 
          className="w-full h-48 object-cover rounded-t-lg"
        />
        <div className="absolute top-2 right-2">
          <span className="badge badge-info">
            Just Started
          </span>
        </div>
      </div>
      <div className="p-4 flex-grow flex flex-col">
        <h3 className="font-bold text-lg mb-2">{course.name}</h3>
        <p className="text-gray-600 text-sm mb-4 flex-grow line-clamp-2">
          {course.description}
        </p>

        <div className="mt-2 mb-3">
          <div className="flex justify-between text-sm mb-1">
            <span>Progress</span>
            <span>{course.progress}%</span>
          </div>
          <Progress value={course.progress} className="h-2" />
        </div>

        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <span>{course.duration} weeks</span>
          <span>•</span>
          <span className={`
            ${course.level === 'Beginner' ? 'text-green-600' : ''}
            ${course.level === 'Intermediate' ? 'text-blue-600' : ''}
            ${course.level === 'Advanced' ? 'text-red-600' : ''}
          `}>
            {course.level}
          </span>
        </div>
      </div>
      <div className="p-4 border-t border-gray-100 grid grid-cols-2 gap-2">
        <Link 
          to={`/course/${course.id}/learn`} 
          className="btn-primary text-center text-sm"
        >
          Continue
        </Link>
        <Link 
          to={`/courses/${course.id}`} 
          className="btn-secondary text-center text-sm"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default CourseProgress;
