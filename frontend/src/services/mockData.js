// Mock Users
export const mockUsers = [
  {
    id: 1,
    first_name: 'Admin',
    last_name: 'User',
    email: 'admin@example.com',
    password: 'admin123',
    role: 'admin',
    created_at: '2024-01-01'
  },
  {
    id: 2,
    first_name: 'John',
    last_name: 'Doe',
    email: 'john@example.com',
    password: 'student123',
    role: 'student',
    created_at: '2024-01-02'
  },
  {
    id: 3,
    first_name: 'Jane',
    last_name: 'Smith',
    email: 'jane@example.com',
    password: 'student123',
    role: 'student',
    created_at: '2024-01-03'
  }
];

// Mock Courses
export const mockCourses = [
  {
    id: 1,
    title: 'Web Development Bootcamp',
    description: 'Learn modern web development from scratch. Master HTML, CSS, JavaScript, and popular frameworks.',
    price: 299,
    duration: '12 weeks',
    level: 'Beginner',
    category: 'Web Development',
    thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-1.2.1&auto=format&fit=crop&w=1352&q=80',
    max_students: 30,
    start_date: '2024-03-01',
    end_date: '2024-05-24',
    schedule: 'Mon, Wed, Fri 6:00 PM - 8:00 PM',
    prerequisites: 'Basic computer skills',
    learning_objectives: [
      'Build responsive websites',
      'Create dynamic web applications',
      'Deploy websites to production',
      'Work with databases'
    ],
    is_active: true,
    enrolled_students: 15,
    sections: [
      {
        id: 1,
        title: 'Introduction to Web Development',
        description: 'Get started with the basics of web development',
        order: 1,
        videos: [
          {
            id: 1,
            title: 'Welcome to the Course',
            description: 'Introduction to the course and what you will learn',
            duration: '5:30',
            videoUrl: 'https://example.com/videos/welcome.mp4',
            thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-1.2.1&auto=format&fit=crop&w=1352&q=80',
            isPreview: true
          },
          {
            id: 2,
            title: 'Setting Up Your Development Environment',
            description: 'Learn how to set up your computer for web development',
            duration: '10:15',
            videoUrl: 'https://example.com/videos/setup.mp4',
            thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-1.2.1&auto=format&fit=crop&w=1352&q=80',
            isPreview: false
          }
        ]
      },
      {
        id: 2,
        title: 'HTML Fundamentals',
        description: 'Learn the building blocks of web pages',
        order: 2,
        videos: [
          {
            id: 3,
            title: 'HTML Structure and Elements',
            description: 'Understanding HTML document structure and basic elements',
            duration: '15:20',
            videoUrl: 'https://example.com/videos/html-structure.mp4',
            thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-1.2.1&auto=format&fit=crop&w=1352&q=80',
            isPreview: false
          },
          {
            id: 4,
            title: 'Forms and Input Elements',
            description: 'Creating interactive forms with HTML',
            duration: '12:45',
            videoUrl: 'https://example.com/videos/html-forms.mp4',
            thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-1.2.1&auto=format&fit=crop&w=1352&q=80',
            isPreview: false
          }
        ]
      },
      {
        id: 3,
        title: 'CSS Styling',
        description: 'Make your websites beautiful with CSS',
        order: 3,
        videos: [
          {
            id: 5,
            title: 'CSS Basics and Selectors',
            description: 'Introduction to CSS and how to select elements',
            duration: '18:30',
            videoUrl: 'https://example.com/videos/css-basics.mp4',
            thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-1.2.1&auto=format&fit=crop&w=1352&q=80',
            isPreview: false
          },
          {
            id: 6,
            title: 'Layout and Flexbox',
            description: 'Creating responsive layouts with Flexbox',
            duration: '20:15',
            videoUrl: 'https://example.com/videos/flexbox.mp4',
            thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-1.2.1&auto=format&fit=crop&w=1352&q=80',
            isPreview: false
          }
        ]
      }
    ]
  },
  {
    id: 2,
    title: 'Data Science Fundamentals',
    description: 'Master the fundamentals of data science, including Python, statistics, and machine learning.',
    price: 399,
    duration: '16 weeks',
    level: 'Intermediate',
    category: 'Data Science',
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    max_students: 25,
    start_date: '2024-03-15',
    end_date: '2024-07-07',
    schedule: 'Tue, Thu 7:00 PM - 9:00 PM',
    prerequisites: 'Basic Python knowledge',
    learning_objectives: [
      'Analyze and visualize data',
      'Build machine learning models',
      'Work with big data',
      'Create data-driven solutions'
    ],
    is_active: true,
    enrolled_students: 12,
    sections: [
      {
        id: 1,
        title: 'Introduction to Data Science',
        description: 'Get started with data science fundamentals',
        order: 1,
        videos: [
          {
            id: 1,
            title: 'Welcome to Data Science',
            description: 'Introduction to the course and data science concepts',
            duration: '8:30',
            videoUrl: 'https://example.com/videos/ds-welcome.mp4',
            thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
            isPreview: true
          },
          {
            id: 2,
            title: 'Python for Data Science',
            description: 'Setting up Python and essential libraries',
            duration: '12:15',
            videoUrl: 'https://example.com/videos/python-ds.mp4',
            thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
            isPreview: false
          }
        ]
      }
    ]
  },
  {
    id: 3,
    title: 'Mobile App Development',
    description: 'Learn to build native mobile applications for iOS and Android using React Native.',
    price: 349,
    duration: '14 weeks',
    level: 'Intermediate',
    category: 'Mobile Development',
    thumbnail: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    max_students: 20,
    start_date: '2024-04-01',
    end_date: '2024-07-07',
    schedule: 'Mon, Wed 6:30 PM - 8:30 PM',
    prerequisites: 'JavaScript basics',
    learning_objectives: [
      'Build cross-platform mobile apps',
      'Implement native features',
      'Handle state management',
      'Deploy to app stores'
    ],
    is_active: true,
    enrolled_students: 8,
    sections: [
      {
        id: 1,
        title: 'Introduction to Mobile Development',
        description: 'Get started with mobile app development fundamentals',
        order: 1,
        videos: [
          {
            id: 1,
            title: 'Welcome to Mobile Development',
            description: 'Introduction to mobile app development and React Native',
            duration: '7:45',
            videoUrl: 'https://example.com/videos/mobile-intro.mp4',
            thumbnail: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
            isPreview: true
          },
          {
            id: 2,
            title: 'Setting Up Your Development Environment',
            description: 'Configure your environment for React Native development',
            duration: '14:30',
            videoUrl: 'https://example.com/videos/mobile-setup.mp4',
            thumbnail: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
            isPreview: false
          }
        ]
      }
    ]
  }
];

// Mock Enrollments
export const mockEnrollments = [
  {
    id: 1,
    user_id: 2,
    course_id: 1,
    progress: 45,
    status: 'active',
    enrolled_at: '2024-02-15'
  },
  {
    id: 2,
    user_id: 2,
    course_id: 2,
    progress: 30,
    status: 'active',
    enrolled_at: '2024-02-20'
  },
  {
    id: 3,
    user_id: 3,
    course_id: 1,
    progress: 60,
    status: 'active',
    enrolled_at: '2024-02-10'
  }
];

// Mock API Service
export const mockApiService = {
  // Auth
  login: async (email, password) => {
    const user = mockUsers.find(u => u.email === email && u.password === password);
    if (user) {
      const { password, ...userWithoutPassword } = user;
      return {
        success: true,
        data: {
          token: 'mock-jwt-token',
          user: userWithoutPassword
        }
      };
    }
    return {
      success: false,
      error: 'Invalid credentials'
    };
  },

  register: async (userData) => {
    const existingUser = mockUsers.find(u => u.email === userData.email);
    if (existingUser) {
      return {
        success: false,
        error: 'Email already exists'
      };
    }

    const newUser = {
      id: mockUsers.length + 1,
      ...userData,
      role: 'student',
      created_at: new Date().toISOString()
    };

    mockUsers.push(newUser);
    const { password, ...userWithoutPassword } = newUser;

    return {
      success: true,
      data: {
        token: 'mock-jwt-token',
        user: userWithoutPassword
      }
    };
  },

  // Users
  getUsers: async () => {
    return {
      success: true,
      data: mockUsers
    };
  },

  getUser: async (id) => {
    const user = mockUsers.find(u => u.id === parseInt(id));
    if (user) {
      const { password, ...userWithoutPassword } = user;
      return {
        success: true,
        data: userWithoutPassword
      };
    }
    return {
      success: false,
      error: 'User not found'
    };
  },

  updateUser: async (id, userData) => {
    const index = mockUsers.findIndex(u => u.id === parseInt(id));
    if (index !== -1) {
      mockUsers[index] = { ...mockUsers[index], ...userData };
      const { password, ...userWithoutPassword } = mockUsers[index];
      return {
        success: true,
        data: userWithoutPassword
      };
    }
    return {
      success: false,
      error: 'User not found'
    };
  },

  deleteUser: async (id) => {
    const index = mockUsers.findIndex(u => u.id === parseInt(id));
    if (index !== -1) {
      mockUsers.splice(index, 1);
      return {
        success: true
      };
    }
    return {
      success: false,
      error: 'User not found'
    };
  },

  // Courses
  getCourses: async () => {
    return {
      success: true,
      data: mockCourses
    };
  },

  getCourse: async (id) => {
    try {
      const courseId = typeof id === 'string' ? parseInt(id, 10) : id;
      
      if (isNaN(courseId)) {
        return {
          success: false,
          error: 'Invalid course ID'
        };
      }
      
      const course = mockCourses.find(c => c.id === courseId);
      
      if (course) {
        return {
          success: true,
          data: course
        };
      }
      
      return {
        success: false,
        error: 'Course not found'
      };
    } catch (error) {
      console.error('Error in getCourse:', error);
      return {
        success: false,
        error: 'Failed to fetch course details'
      };
    }
  },

  createCourse: async (courseData) => {
    const newCourse = {
      id: mockCourses.length + 1,
      ...courseData,
      enrolled_students: 0,
      created_at: new Date().toISOString()
    };
    mockCourses.push(newCourse);
    return {
      success: true,
      data: newCourse
    };
  },

  updateCourse: async (id, courseData) => {
    const index = mockCourses.findIndex(c => c.id === parseInt(id));
    if (index !== -1) {
      mockCourses[index] = { ...mockCourses[index], ...courseData };
      return {
        success: true,
        data: mockCourses[index]
      };
    }
    return {
      success: false,
      error: 'Course not found'
    };
  },

  deleteCourse: async (id) => {
    const index = mockCourses.findIndex(c => c.id === parseInt(id));
    if (index !== -1) {
      mockCourses.splice(index, 1);
      return {
        success: true
      };
    }
    return {
      success: false,
      error: 'Course not found'
    };
  },

  // Enrollments
  getEnrolledCourses: async (userId) => {
    const userEnrollments = mockEnrollments.filter(e => e.user_id === userId);
    const enrolledCourses = userEnrollments.map(enrollment => {
      const course = mockCourses.find(c => c.id === enrollment.course_id);
      return {
        ...course,
        progress: enrollment.progress,
        status: enrollment.status
      };
    });
    return {
      success: true,
      data: enrolledCourses
    };
  },

  enrollInCourse: async (userId, courseId) => {
    const existingEnrollment = mockEnrollments.find(
      e => e.user_id === userId && e.course_id === courseId
    );
    if (existingEnrollment) {
      return {
        success: false,
        error: 'Already enrolled in this course'
      };
    }

    const newEnrollment = {
      id: mockEnrollments.length + 1,
      user_id: userId,
      course_id: courseId,
      progress: 0,
      status: 'active',
      enrolled_at: new Date().toISOString()
    };
    mockEnrollments.push(newEnrollment);

    const course = mockCourses.find(c => c.id === courseId);
    if (course) {
      course.enrolled_students += 1;
    }

    return {
      success: true,
      data: newEnrollment
    };
  },

  // Add new method to get video details
  getVideoDetails: async (courseId, videoId) => {
    const course = mockCourses.find(c => c.id === parseInt(courseId));
    if (!course) {
      return {
        success: false,
        error: 'Course not found'
      };
    }

    const video = course.sections
      .flatMap(section => section.videos)
      .find(v => v.id === parseInt(videoId));

    if (video) {
      return {
        success: true,
        data: video
      };
    }

    return {
      success: false,
      error: 'Video not found'
    };
  }
}; 