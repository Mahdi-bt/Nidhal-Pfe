
import { toast } from "@/components/ui/sonner";

// Define base API URL
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

// Define types for API responses
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'student' | 'instructor';
  createdAt: string;
}

export interface Course {
  id: string;
  name: string;
  description: string;
  price: number;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  category: string;
  duration: number; // in weeks
  enrolledStudents: number;
  thumbnail: string;
  sections: Section[];
  createdAt: string;
}

export interface Section {
  id: string;
  name: string;
  videos: Video[];
}

export interface Video {
  id: string;
  name: string;
  duration: number; // in seconds
  url: string;
}

export interface Enrollment {
  id: string;
  courseId: string;
  userId: string;
  progress: number; // 0-100
  startedAt: string;
  completedAt: string | null;
}

export interface Payment {
  id: string;
  userId: string;
  courseId: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  createdAt: string;
}

export interface Progress {
  courseId: string;
  videoId: string;
  progress: number; // 0-100
  lastPosition: number; // in seconds
  completed: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

// Mock data for development
const mockUsers: User[] = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'admin',
    createdAt: '2023-01-01',
  },
  {
    id: '2',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'student',
    createdAt: '2023-01-05',
  },
  {
    id: '3',
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'student',
    createdAt: '2023-01-10',
  },
];

const mockCourses: Course[] = [
  {
    id: '1',
    name: 'Web Development Bootcamp',
    description: 'Learn modern web development from scratch. Master HTML, CSS, JavaScript, and popular frameworks.',
    price: 299,
    level: 'Beginner',
    category: 'Web Development',
    duration: 12,
    enrolledStudents: 15,
    thumbnail: '/lovable-uploads/4fc38c23-4919-4cc2-a98e-b334f3f7a6b5.png',
    sections: [
      {
        id: 's1',
        name: 'Introduction to Web Development',
        videos: [
          {
            id: 'v1',
            name: 'Welcome to the Course',
            duration: 350,
            url: 'https://example.com/video1.mp4',
          },
          {
            id: 'v2',
            name: 'Setting Up Your Development Environment',
            duration: 610,
            url: 'https://example.com/video2.mp4',
          },
        ],
      },
      {
        id: 's2',
        name: 'HTML Fundamentals',
        videos: [
          {
            id: 'v3',
            name: 'HTML Basics',
            duration: 720,
            url: 'https://example.com/video3.mp4',
          },
          {
            id: 'v4',
            name: 'HTML Forms and Input Elements',
            duration: 840,
            url: 'https://example.com/video4.mp4',
          },
        ],
      },
    ],
    createdAt: '2023-01-15',
  },
  {
    id: '2',
    name: 'Data Science Fundamentals',
    description: 'Master the fundamentals of data science, including Python, statistics, and machine learning.',
    price: 399,
    level: 'Intermediate',
    category: 'Data Science',
    duration: 16,
    enrolledStudents: 12,
    thumbnail: '/lovable-uploads/3f4d9c1e-1c23-4ea0-8d0f-3c3acb82eb5b.png',
    sections: [
      {
        id: 's3',
        name: 'Introduction to Python for Data Science',
        videos: [
          {
            id: 'v5',
            name: 'Python Basics',
            duration: 580,
            url: 'https://example.com/video5.mp4',
          },
          {
            id: 'v6',
            name: 'Data Manipulation with Pandas',
            duration: 720,
            url: 'https://example.com/video6.mp4',
          },
        ],
      },
    ],
    createdAt: '2023-02-01',
  },
  {
    id: '3',
    name: 'Mobile App Development',
    description: 'Learn to build native mobile applications for iOS and Android using React Native.',
    price: 349,
    level: 'Intermediate',
    category: 'Mobile Development',
    duration: 14,
    enrolledStudents: 8,
    thumbnail: '/lovable-uploads/bdef662c-03a7-45cc-819f-3c6650818c7c.png',
    sections: [
      {
        id: 's4',
        name: 'Getting Started with React Native',
        videos: [
          {
            id: 'v7',
            name: 'React Native Basics',
            duration: 650,
            url: 'https://example.com/video7.mp4',
          },
        ],
      },
    ],
    createdAt: '2023-03-01',
  },
];

const mockEnrollments: Enrollment[] = [
  {
    id: 'e1',
    courseId: '1',
    userId: '2',
    progress: 45,
    startedAt: '2023-02-01',
    completedAt: null,
  },
  {
    id: 'e2',
    courseId: '2',
    userId: '2',
    progress: 30,
    startedAt: '2023-03-01',
    completedAt: null,
  },
];

// Authentication functions
export async function login(credentials: LoginCredentials): Promise<AuthResponse> {
  try {
    // In a real app, this would be a fetch request
    // const response = await fetch(`${BASE_URL}/auth/login`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(credentials),
    // });
    
    // Mock authentication logic
    const user = mockUsers.find(u => u.email === credentials.email);
    
    if (!user) {
      throw new Error('Invalid credentials');
    }
    
    if (credentials.password !== 'password123') {
      throw new Error('Invalid credentials');
    }
    
    // Mock token
    const token = 'mock-jwt-token';
    
    // Store token in localStorage
    localStorage.setItem('auth_token', token);
    localStorage.setItem('user', JSON.stringify(user));
    
    return { user, token };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to login';
    toast.error(message);
    throw error;
  }
}

export async function register(credentials: RegisterCredentials): Promise<AuthResponse> {
  try {
    // In a real app, this would be a fetch request
    // const response = await fetch(`${BASE_URL}/auth/register`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(credentials),
    // });
    
    // Check if email exists
    const existingUser = mockUsers.find(u => u.email === credentials.email);
    
    if (existingUser) {
      throw new Error('Email already exists');
    }
    
    // Create new user
    const newUser: User = {
      id: `${mockUsers.length + 1}`,
      name: credentials.name,
      email: credentials.email,
      role: 'student',
      createdAt: new Date().toISOString(),
    };
    
    mockUsers.push(newUser);
    
    // Mock token
    const token = 'mock-jwt-token';
    
    // Store token in localStorage
    localStorage.setItem('auth_token', token);
    localStorage.setItem('user', JSON.stringify(newUser));
    
    return { user: newUser, token };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to register';
    toast.error(message);
    throw error;
  }
}

export function logout(): void {
  localStorage.removeItem('auth_token');
  localStorage.removeItem('user');
  window.location.href = '/';
}

export function getCurrentUser(): User | null {
  const userString = localStorage.getItem('user');
  return userString ? JSON.parse(userString) : null;
}

export function isAuthenticated(): boolean {
  return !!localStorage.getItem('auth_token');
}

export function isAdmin(): boolean {
  const user = getCurrentUser();
  return user ? user.role === 'admin' : false;
}

// Course functions
export async function getAllCourses(): Promise<Course[]> {
  try {
    // In a real app, this would be a fetch request
    // const response = await fetch(`${BASE_URL}/courses`);
    
    return mockCourses;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch courses';
    toast.error(message);
    throw error;
  }
}

export async function getCourseById(id: string): Promise<Course> {
  try {
    // In a real app, this would be a fetch request
    // const response = await fetch(`${BASE_URL}/courses/${id}`);
    
    const course = mockCourses.find(c => c.id === id);
    
    if (!course) {
      throw new Error('Course not found');
    }
    
    return course;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch course';
    toast.error(message);
    throw error;
  }
}

export async function getEnrolledCourses(userId: string): Promise<(Course & { progress: number })[]> {
  try {
    // In a real app, this would be a fetch request
    // const response = await fetch(`${BASE_URL}/courses/enrolled`);
    
    const enrollments = mockEnrollments.filter(e => e.userId === userId);
    
    return enrollments.map(enrollment => {
      const course = mockCourses.find(c => c.id === enrollment.courseId);
      
      if (!course) {
        throw new Error('Course not found');
      }
      
      return {
        ...course,
        progress: enrollment.progress,
      };
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch enrolled courses';
    toast.error(message);
    throw error;
  }
}

export async function createCourse(course: Omit<Course, 'id' | 'createdAt'>): Promise<Course> {
  try {
    // In a real app, this would be a fetch request
    // const response = await fetch(`${BASE_URL}/courses`, {
    //   method: 'POST',
    //   headers: { 
    //     'Content-Type': 'application/json',
    //     'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
    //   },
    //   body: JSON.stringify(course),
    // });
    
    const newCourse: Course = {
      ...course,
      id: `${mockCourses.length + 1}`,
      createdAt: new Date().toISOString(),
    };
    
    mockCourses.push(newCourse);
    
    return newCourse;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create course';
    toast.error(message);
    throw error;
  }
}

export async function updateCourse(id: string, course: Partial<Course>): Promise<Course> {
  try {
    // In a real app, this would be a fetch request
    // const response = await fetch(`${BASE_URL}/courses/${id}`, {
    //   method: 'PUT',
    //   headers: { 
    //     'Content-Type': 'application/json',
    //     'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
    //   },
    //   body: JSON.stringify(course),
    // });
    
    const courseIndex = mockCourses.findIndex(c => c.id === id);
    
    if (courseIndex === -1) {
      throw new Error('Course not found');
    }
    
    mockCourses[courseIndex] = {
      ...mockCourses[courseIndex],
      ...course,
    };
    
    return mockCourses[courseIndex];
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to update course';
    toast.error(message);
    throw error;
  }
}

export async function deleteCourse(id: string): Promise<void> {
  try {
    // In a real app, this would be a fetch request
    // const response = await fetch(`${BASE_URL}/courses/${id}`, {
    //   method: 'DELETE',
    //   headers: { 
    //     'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
    //   },
    // });
    
    const courseIndex = mockCourses.findIndex(c => c.id === id);
    
    if (courseIndex === -1) {
      throw new Error('Course not found');
    }
    
    mockCourses.splice(courseIndex, 1);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to delete course';
    toast.error(message);
    throw error;
  }
}

export async function enrollInCourse(courseId: string): Promise<Enrollment> {
  try {
    // In a real app, this would be a fetch request
    // const response = await fetch(`${BASE_URL}/courses/${courseId}/enroll`, {
    //   method: 'POST',
    //   headers: { 
    //     'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
    //   },
    // });
    
    const user = getCurrentUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    const course = mockCourses.find(c => c.id === courseId);
    
    if (!course) {
      throw new Error('Course not found');
    }
    
    // Check if already enrolled
    const existingEnrollment = mockEnrollments.find(
      e => e.courseId === courseId && e.userId === user.id
    );
    
    if (existingEnrollment) {
      return existingEnrollment;
    }
    
    const newEnrollment: Enrollment = {
      id: `e${mockEnrollments.length + 1}`,
      courseId,
      userId: user.id,
      progress: 0,
      startedAt: new Date().toISOString(),
      completedAt: null,
    };
    
    mockEnrollments.push(newEnrollment);
    
    return newEnrollment;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to enroll in course';
    toast.error(message);
    throw error;
  }
}

// User functions
export async function getAllUsers(): Promise<User[]> {
  try {
    // In a real app, this would be a fetch request
    // const response = await fetch(`${BASE_URL}/users`, {
    //   headers: { 
    //     'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
    //   },
    // });
    
    return mockUsers;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch users';
    toast.error(message);
    throw error;
  }
}

export async function updateUserProfile(
  userId: string, 
  data: { name?: string; email?: string; currentPassword?: string; newPassword?: string }
): Promise<User> {
  try {
    // In a real app, this would be a fetch request
    // const response = await fetch(`${BASE_URL}/users/profile`, {
    //   method: 'PUT',
    //   headers: { 
    //     'Content-Type': 'application/json',
    //     'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
    //   },
    //   body: JSON.stringify(data),
    // });
    
    const userIndex = mockUsers.findIndex(u => u.id === userId);
    
    if (userIndex === -1) {
      throw new Error('User not found');
    }
    
    mockUsers[userIndex] = {
      ...mockUsers[userIndex],
      name: data.name || mockUsers[userIndex].name,
      email: data.email || mockUsers[userIndex].email,
    };
    
    // Update stored user if it's the current user
    if (getCurrentUser()?.id === userId) {
      localStorage.setItem('user', JSON.stringify(mockUsers[userIndex]));
    }
    
    return mockUsers[userIndex];
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to update profile';
    toast.error(message);
    throw error;
  }
}

// Statistics for admin dashboard
export function getStatistics() {
  return {
    totalUsers: 456,
    activeUsers: 287,
    totalCourses: 32,
    totalEnrollments: 1204,
    averageEnrollmentsPerCourse: 38,
    monthlyRevenue: 27000,
    previousMonthRevenue: 25000,
    userGrowth: 12,
    courseGrowth: 5,
    enrollmentGrowth: 18,
    revenueGrowth: 8,
    userDistribution: {
      admins: 8,
      instructors: 25,
      students: 423
    },
    monthlySales: [
      { month: 'Jan', revenue: 18000 },
      { month: 'Feb', revenue: 20000 },
      { month: 'Mar', revenue: 19000 },
      { month: 'Apr', revenue: 22000 },
      { month: 'May', revenue: 24000 },
      { month: 'Jun', revenue: 25000 },
      { month: 'Jul', revenue: 26000 },
      { month: 'Aug', revenue: 27000 },
      { month: 'Sep', revenue: 29000 }
    ],
    coursesByCategory: [
      { category: 'Programming', count: 12 },
      { category: 'Data Science', count: 8 },
      { category: 'Business', count: 6 },
      { category: 'Design', count: 5 },
      { category: 'Marketing', count: 1 }
    ]
  };
}

// Reset password request
export async function requestPasswordReset(email: string): Promise<void> {
  try {
    // In a real app, this would be a fetch request
    // await fetch(`${BASE_URL}/auth/reset-password`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ email }),
    // });
    
    // Check if email exists
    const user = mockUsers.find(u => u.email === email);
    
    if (!user) {
      // Don't reveal whether user exists for security
      return;
    }
    
    // In a real app, this would send an email
    console.log(`Password reset email sent to ${email}`);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to request password reset';
    toast.error(message);
    throw error;
  }
}

// Progress tracking functions
export async function updateVideoProgress(
  videoId: string, 
  data: { progress: number; lastPosition: number }
): Promise<Progress> {
  try {
    // In a real app, this would be a fetch request
    // await fetch(`${BASE_URL}/progress/videos/${videoId}`, {
    //   method: 'POST',
    //   headers: { 
    //     'Content-Type': 'application/json',
    //     'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
    //   },
    //   body: JSON.stringify(data),
    // });
    
    // For mock data, we'll just log this
    console.log(`Updated progress for video ${videoId}:`, data);
    
    // Find course ID from video ID
    let courseId = '';
    for (const course of mockCourses) {
      for (const section of course.sections) {
        const video = section.videos.find(v => v.id === videoId);
        if (video) {
          courseId = course.id;
          break;
        }
      }
      if (courseId) break;
    }
    
    if (!courseId) {
      throw new Error('Video not found');
    }
    
    // Update enrollment progress
    const user = getCurrentUser();
    if (user) {
      const enrollmentIndex = mockEnrollments.findIndex(
        e => e.courseId === courseId && e.userId === user.id
      );
      
      if (enrollmentIndex !== -1) {
        mockEnrollments[enrollmentIndex].progress = data.progress * 100;
      }
    }
    
    return {
      courseId,
      videoId,
      progress: data.progress,
      lastPosition: data.lastPosition,
      completed: data.progress >= 0.95, // 95% is considered complete
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to update progress';
    toast.error(message);
    throw error;
  }
}
