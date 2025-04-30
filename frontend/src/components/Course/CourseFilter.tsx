
import React from 'react';

interface CourseFilterProps {
  onSearch: (query: string) => void;
  onCategoryChange: (category: string) => void;
  onLevelChange: (level: string) => void;
  categories: string[];
  levels: string[];
}

const CourseFilter: React.FC<CourseFilterProps> = ({ 
  onSearch, 
  onCategoryChange, 
  onLevelChange,
  categories,
  levels
}) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-8">
      <div className="w-full md:w-1/3">
        <input
          type="text"
          placeholder="Search courses..."
          className="input-field"
          onChange={(e) => onSearch(e.target.value)}
        />
      </div>
      <div className="w-full md:w-1/3">
        <select 
          className="input-field"
          onChange={(e) => onCategoryChange(e.target.value)}
        >
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>
      <div className="w-full md:w-1/3">
        <select 
          className="input-field"
          onChange={(e) => onLevelChange(e.target.value)}
        >
          <option value="">All Levels</option>
          {levels.map((level) => (
            <option key={level} value={level}>
              {level}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default CourseFilter;
