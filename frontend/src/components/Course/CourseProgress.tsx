import React from 'react';
import { Link } from 'react-router-dom';
import { Course } from '@/lib/api';
import { Progress } from '@/components/ui/progress';

interface CourseProgressProps {
  course: Course & {
    progress: {
      overall: number;
      completed: boolean;
      sections: Array<{
        id: string;
        name: string;
        progress: number;
        videoProgress: Array<{
          id: string;
          videoId: string;
          watched: boolean;
          progress: number;
          lastPosition: number;
        }>;
      }>;
    };
  };
}
const getFileUrl = (path: string) => {
  if (!path) return '/placeholder-image.jpg';
  return `http://localhost:3000/${path}`;
};

const CourseProgress: React.FC<CourseProgressProps> = ({ course }) => {
  const progressPercentage = Math.round(course.progress.overall * 100);

  return (
    <div className="card h-full flex flex-col">
      <div className="relative">
        <img 
          src={ getFileUrl(course.thumbnail) || '/placeholder-course.jpg'} 
          alt={course.name} 
          className="w-full h-48 object-cover rounded-t-lg"
        />
        <div className="absolute top-2 right-2">
          <span className={`badge ${
            course.progress.completed ? 'badge-success' :
            course.progress.overall > 0 ? 'badge-info' :
            'badge-warning'
          }`}>
            {course.progress.completed ? 'Completed' :
             course.progress.overall > 0 ? 'In Progress' :
             'Not Started'}
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
            <span>{progressPercentage}%</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>

        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <span>{course.duration} weeks</span>
          <span>•</span>
          <span className={`
            ${course.level === 'BEGINNER' ? 'text-green-600' : ''}
            ${course.level === 'INTERMEDIATE' ? 'text-blue-600' : ''}
            ${course.level === 'ADVANCED' ? 'text-red-600' : ''}
          `}>
            {course.level}
          </span>
        </div>
      </div>
      <div className="p-4 border-t border-gray-100 grid grid-cols-2 gap-2">
        <Link 
          to={`/courses/${course.id}/learn`} 
          className="btn-primary text-center text-sm"
        >
          {course.progress.overall > 0 ? 'Continue' : 'Start Learning'}
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
