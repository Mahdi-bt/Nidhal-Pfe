import { toast } from "@/components/ui/sonner";

// Define base API URL
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

// Define types for API responses
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'student' | 'instructor';
  status: 'ACTIVE' | 'BLOCKED';
  createdAt: string;
}

export interface Course {
  id: string;
  name: string;
  description: string;
  price: number;
  level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  category: string;
  duration: number; // in weeks
  enrolledStudents: number;
  thumbnail: string;
  sections: Section[];
  createdAt: string;
  enrollment?: {
    id: string;
    status: string;
    enrolledAt: string;
  };
  progress?: {
    overall: number;
    completed: boolean;
    sections: {
      id: string;
      name: string;
      progress: number;
      videoProgress: {
        id: string;
        videoId: string;
        watched: boolean;
        progress: number;
        lastPosition: number;
      }[];
    }[];
  };
}

export interface Section {
  id: string;
  name: string;
  videos: {
    id: string;
    name: string;
    duration: number;
    filePath: string;
  }[];
}

export interface Video {
  id?: string;
  name: string;
  duration: number;
  filePath?: string;
  file?: File;
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
  status: 'completed' | 'failed' | 'pending';
  createdAt: string;
}

export interface PaymentStats {
  completed: number;
  pending: number;
  failed: number;
}

export interface MonthlyRevenue {
  month: string;
  revenue: number;
}

export interface Progress {
  videoProgress: {
    id: string;
    videoId: string;
    watched: boolean;
    progress: number;
    lastPosition: number;
  };
  courseProgress: {
    id: string;
    userId: string;
    courseId: string;
    progress: number;
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
    status: 'ACTIVE',
    createdAt: '2023-01-01',
  },
  {
    id: '2',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'student',
    status: 'ACTIVE',
    createdAt: '2023-01-05',
  },
  {
    id: '3',
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'student',
    status: 'ACTIVE',
    createdAt: '2023-01-10',
  },
];

const mockCourses: Course[] = [
  {
    id: '1',
    name: 'Web Development Bootcamp',
    description: 'Learn modern web development from scratch. Master HTML, CSS, JavaScript, and popular frameworks.',
    price: 299,
    level: 'BEGINNER',
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
            filePath: 'https://example.com/video1.mp4',
          },
          {
            id: 'v2',
            name: 'Setting Up Your Development Environment',
            duration: 610,
            filePath: 'https://example.com/video2.mp4',
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
            filePath: 'https://example.com/video3.mp4',
          },
          {
            id: 'v4',
            name: 'HTML Forms and Input Elements',
            duration: 840,
            filePath: 'https://example.com/video4.mp4',
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
    level: 'INTERMEDIATE',
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
            filePath: 'https://example.com/video5.mp4',
          },
          {
            id: 'v6',
            name: 'Data Manipulation with Pandas',
            duration: 720,
            filePath: 'https://example.com/video6.mp4',
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
    level: 'INTERMEDIATE',
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
            filePath: 'https://example.com/video7.mp4',
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
    const response = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to login');
    }

    const data = await response.json();
    
    // Store the token in localStorage
    localStorage.setItem('token', data.token);
    
    // Store user data in localStorage
    localStorage.setItem('user', JSON.stringify(data.user));
    
    return data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
}

export async function register(credentials: RegisterCredentials): Promise<AuthResponse> {
  try {
    const response = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to register');
    }

    const data = await response.json();
    
    // Store token in localStorage
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    
    return data;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to register';
    toast.error(message);
    throw error;
  }
}

export function logout(): void {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '/';
}

export function getCurrentUser(): User | null {
  const userString = localStorage.getItem('user');
  return userString ? JSON.parse(userString) : null;
}

export function isAuthenticated(): boolean {
  return !!localStorage.getItem('token');
}

export function isAdmin(): boolean {
  const user = getCurrentUser();
  return user ? user.role === 'admin' : false;
}

// Course functions
export async function getAllCourses(): Promise<Course[]> {
  try {
    const response = await fetch(`${BASE_URL}/courses`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch courses');
    }

    return await response.json();
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch courses';
    toast.error(message);
    throw error;
  }
}

export async function getCourseById(id: string): Promise<Course> {
  try {
    const response = await fetch(`${BASE_URL}/courses/${id}`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch course');
    }

    return await response.json();
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch course';
    toast.error(message);
    throw error;
  }
}

// Helper function to get the auth header
const getAuthHeader = () => ({
  'Authorization': `Bearer ${localStorage.getItem('token')}`
});

export async function getEnrolledCourses(userId: string): Promise<(Course & {
  progress: {
    overall: number;
    completed: boolean;
    sections: {
      id: string;
      name: string;
      progress: number;
      videoProgress: {
        id: string;
        videoId: string;
        watched: boolean;
        progress: number;
        lastPosition: number;
      }[];
    }[];
  };
})[]> {
  try {
    console.log('Fetching enrolled courses for user:', userId);
    
    const response = await fetch(`${BASE_URL}/courses/enrolled`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });

    console.log('Enrolled courses response status:', response.status);

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error fetching enrolled courses:', errorData);
      throw new Error(errorData.message || 'Failed to fetch enrolled courses');
    }

    const data = await response.json();
    console.log('Enrolled courses data:', data);
    return data;
  } catch (error) {
    console.error('Error in getEnrolledCourses:', error);
    throw error;
  }
}

export const createCourse = async (formData: FormData): Promise<Course> => {
  const response = await fetch(`${BASE_URL}/courses`, {
    method: 'POST',
    headers: getAuthHeader(),
    body: formData,
  });
  if (!response.ok) {
    throw new Error('Failed to create course');
  }
  return response.json();
};

export const updateCourse = async (id: string, formData: FormData): Promise<Course> => {
  const response = await fetch(`${BASE_URL}/courses/${id}`, {
    method: 'PUT',
    headers: getAuthHeader(),
    body: formData,
  });
  if (!response.ok) {
    throw new Error('Failed to update course');
  }
  return response.json();
};

export async function deleteCourse(id: string): Promise<void> {
  try {
    const response = await fetch(`${BASE_URL}/courses/${id}`, {
      method: 'DELETE',
      headers: getAuthHeader(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to delete course');
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to delete course';
    toast.error(message);
    throw error;
  }
}

export async function enrollInCourse(courseId: string): Promise<Enrollment> {
  try {
    const response = await fetch(`${BASE_URL}/courses/${courseId}/enroll`, {
      method: 'POST',
      headers: getAuthHeader(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to enroll in course');
    }

    return await response.json();
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to enroll in course';
    toast.error(message);
    throw error;
  }
}

// User functions
export async function getAllUsers(): Promise<User[]> {
  try {
    const response = await fetch(`${BASE_URL}/users`, {
      headers: getAuthHeader(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch users');
    }

    return await response.json();
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
    const response = await fetch(`${BASE_URL}/users/profile`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update profile');
    }

    const updatedUser = await response.json();
    
    // Update stored user if it's the current user
    if (getCurrentUser()?.id === userId) {
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
    
    return updatedUser;
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
    const response = await fetch(`${BASE_URL}/progress/video/${videoId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update video progress');
    }

    return response.json();
  } catch (error) {
    console.error('Error updating video progress:', error);
    throw error;
  }
}

// Payment functions
export async function createPaymentIntent(courseId: string, userId: string): Promise<{ clientSecret: string; paymentIntentId: string; amount: number }> {
  console.log('Creating payment intent:', { courseId, userId });
  
  try {
    const response = await fetch(`${BASE_URL}/payments/create-intent/${courseId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });

    console.log('Payment intent response status:', response.status);
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Payment intent error:', errorData);
      throw new Error(errorData.message || 'Failed to create payment intent');
    }

    const data = await response.json();
    console.log('Payment intent created successfully:', data);
    return data;
  } catch (error) {
    console.error('Error in createPaymentIntent:', error);
    throw error;
  }
}

export async function confirmPayment(paymentIntentId: string): Promise<Payment> {
  try {
    const response = await fetch(`${BASE_URL}/payments/confirm/${paymentIntentId}`, {
      method: 'POST',
      headers: getAuthHeader(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to confirm payment');
    }

    return await response.json();
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to confirm payment';
    toast.error(message);
    throw error;
  }
}

export async function getPaymentStatus(paymentIntentId: string): Promise<Payment> {
  try {
    const response = await fetch(`${BASE_URL}/payments/status/${paymentIntentId}`, {
      headers: getAuthHeader(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to get payment status');
    }

    return await response.json();
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to get payment status';
    toast.error(message);
    throw error;
  }
}

export async function getMyTransactions(): Promise<Payment[]> {
  try {
    const response = await fetch(`${BASE_URL}/payments/my-transactions`, {
      headers: getAuthHeader(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to get transactions');
    }

    return await response.json();
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to get transactions';
    toast.error(message);
    throw error;
  }
}

export async function downloadInvoice(paymentIntentId: string): Promise<Blob> {
  try {
    const response = await fetch(`${BASE_URL}/payments/invoice/${paymentIntentId}`, {
      headers: getAuthHeader(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to download invoice');
    }

    return await response.blob();
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to download invoice';
    toast.error(message);
    throw error;
  }
}

export const updateUserStatus = async (userId: string, status: 'ACTIVE' | 'BLOCKED'): Promise<User> => {
  const response = await fetch(`${BASE_URL}/users/${userId}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
    body: JSON.stringify({ status })
  });

  if (!response.ok) {
    throw new Error('Failed to update user status');
  }

  return response.json();
};

export const getAllPayments = async (): Promise<Payment[]> => {
  try {
    const response = await fetch(`${BASE_URL}/payments`, {
      headers: {
        ...getAuthHeader(),
      },
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch payments');
    }
    
    return response.json();
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch payments';
    toast.error(message);
    throw error;
  }
};

export const getSuccessfulPaymentsStats = async (): Promise<PaymentStats> => {
  try {
    const response = await fetch(`${BASE_URL}/payments/statistics/successful`, {
      headers: {
        ...getAuthHeader(),
      },
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch payment statistics');
    }
    
    return response.json();
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch payment statistics';
    toast.error(message);
    throw error;
  }
};

export const getMonthlyRevenueStats = async (): Promise<MonthlyRevenue[]> => {
  try {
    const response = await fetch(`${BASE_URL}/payments/statistics/monthly-revenue`, {
      headers: {
        ...getAuthHeader(),
      },
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch monthly revenue statistics');
    }
    
    return response.json();
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch monthly revenue statistics';
    toast.error(message);
    throw error;
  }
};
