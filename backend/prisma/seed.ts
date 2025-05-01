import { PrismaClient, Role, EnrollmentStatus, User, Course } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Create default admin account
  const adminEmail = 'admin@example.com';
  const adminPassword = 'admin123'; // You should change this in production

  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    await prisma.user.create({
      data: {
        email: adminEmail,
        password: hashedPassword,
        name: 'Admin User',
        role: Role.ADMIN,
      },
    });
    console.log('Default admin account created successfully');
  } else {
    console.log('Admin account already exists');
  }

  // Create sample users
  const users = [
    {
      email: 'john.doe@example.com',
      password: 'password123',
      name: 'John Doe',
      role: Role.USER,
    },
    {
      email: 'jane.smith@example.com',
      password: 'password123',
      name: 'Jane Smith',
      role: Role.USER,
    },
    {
      email: 'bob.wilson@example.com',
      password: 'password123',
      name: 'Bob Wilson',
      role: Role.USER,
    },
  ];

  const createdUsers: User[] = [];
  for (const user of users) {
    const existingUser = await prisma.user.findUnique({
      where: { email: user.email },
    });

    if (!existingUser) {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      const newUser = await prisma.user.create({
        data: {
          ...user,
          password: hashedPassword,
        },
      });
      createdUsers.push(newUser);
      console.log(`User ${user.email} created successfully`);
    } else {
      createdUsers.push(existingUser);
      console.log(`User ${user.email} already exists`);
    }
  }

  // Create sample courses with sections
  const courses = [
    {
      name: 'Web Development Bootcamp',
      description: 'Learn full-stack web development from scratch. Covers HTML, CSS, JavaScript, React, Node.js, and more.',
      price: 199.99,
      category: 'Web Development',
      duration: 12, // duration in weeks
      sections: [
        {
          name: 'HTML & CSS Fundamentals',
          videos: [
            { name: 'Introduction to HTML', filePath: '/videos/html-intro.mp4' },
            { name: 'HTML Structure and Elements', filePath: '/videos/html-structure.mp4' },
            { name: 'CSS Basics and Styling', filePath: '/videos/css-basics.mp4' },
          ]
        },
        {
          name: 'JavaScript Essentials',
          videos: [
            { name: 'JavaScript Fundamentals', filePath: '/videos/js-fundamentals.mp4' },
            { name: 'DOM Manipulation', filePath: '/videos/dom-manipulation.mp4' },
            { name: 'Async JavaScript', filePath: '/videos/async-js.mp4' },
          ]
        },
        {
          name: 'React Development',
          videos: [
            { name: 'React Components', filePath: '/videos/react-components.mp4' },
            { name: 'State and Props', filePath: '/videos/react-state-props.mp4' },
            { name: 'React Hooks', filePath: '/videos/react-hooks.mp4' },
          ]
        }
      ]
    },
    {
      name: 'Data Science Fundamentals',
      description: 'Master the basics of data science, including Python, statistics, and machine learning.',
      price: 149.99,
      category: 'Data Science',
      duration: 8,
      sections: [
        {
          name: 'Python for Data Science',
          videos: [
            { name: 'Python Basics', filePath: '/videos/python-basics.mp4' },
            { name: 'NumPy and Pandas', filePath: '/videos/numpy-pandas.mp4' },
            { name: 'Data Manipulation', filePath: '/videos/data-manipulation.mp4' },
          ]
        },
        {
          name: 'Statistics and Probability',
          videos: [
            { name: 'Basic Statistics', filePath: '/videos/basic-stats.mp4' },
            { name: 'Probability Theory', filePath: '/videos/probability.mp4' },
            { name: 'Statistical Inference', filePath: '/videos/statistical-inference.mp4' },
          ]
        }
      ]
    },
    {
      name: 'Mobile App Development',
      description: 'Build iOS and Android apps using React Native. Learn mobile development best practices.',
      price: 179.99,
      category: 'Mobile Development',
      duration: 10,
      sections: [
        {
          name: 'React Native Basics',
          videos: [
            { name: 'Setting Up React Native', filePath: '/videos/rn-setup.mp4' },
            { name: 'Components and Navigation', filePath: '/videos/rn-components.mp4' },
            { name: 'State Management', filePath: '/videos/rn-state.mp4' },
          ]
        },
        {
          name: 'Advanced Mobile Features',
          videos: [
            { name: 'Native Modules', filePath: '/videos/native-modules.mp4' },
            { name: 'Performance Optimization', filePath: '/videos/rn-performance.mp4' },
            { name: 'App Deployment', filePath: '/videos/app-deployment.mp4' },
          ]
        }
      ]
    },
    {
      name: 'UI/UX Design Masterclass',
      description: 'Learn modern UI/UX design principles, tools, and techniques for creating beautiful interfaces.',
      price: 129.99,
      category: 'Design',
      duration: 6,
      sections: [
        {
          name: 'Design Fundamentals',
          videos: [
            { name: 'Color Theory', filePath: '/videos/color-theory.mp4' },
            { name: 'Typography', filePath: '/videos/typography.mp4' },
            { name: 'Layout Principles', filePath: '/videos/layout.mp4' },
          ]
        },
        {
          name: 'User Experience',
          videos: [
            { name: 'User Research', filePath: '/videos/user-research.mp4' },
            { name: 'Wireframing', filePath: '/videos/wireframing.mp4' },
            { name: 'Prototyping', filePath: '/videos/prototyping.mp4' },
          ]
        }
      ]
    },
    {
      name: 'DevOps Engineering',
      description: 'Master DevOps practices, tools, and methodologies for modern software development.',
      price: 249.99,
      category: 'DevOps',
      duration: 14,
      sections: [
        {
          name: 'Containerization',
          videos: [
            { name: 'Docker Basics', filePath: '/videos/docker-basics.mp4' },
            { name: 'Docker Compose', filePath: '/videos/docker-compose.mp4' },
            { name: 'Container Orchestration', filePath: '/videos/container-orchestration.mp4' },
          ]
        },
        {
          name: 'CI/CD Pipeline',
          videos: [
            { name: 'GitHub Actions', filePath: '/videos/github-actions.mp4' },
            { name: 'Jenkins Pipeline', filePath: '/videos/jenkins.mp4' },
            { name: 'Deployment Strategies', filePath: '/videos/deployment-strategies.mp4' },
          ]
        }
      ]
    }
  ];

  const createdCourses: Course[] = [];
  for (const courseData of courses) {
    const existingCourse = await prisma.course.findFirst({
      where: { name: courseData.name },
    });

    if (!existingCourse) {
      const { sections, ...courseInfo } = courseData;
      const course = await prisma.course.create({
        data: courseInfo,
      });

      // Create sections and videos
      for (const sectionData of sections) {
        const { videos, ...sectionInfo } = sectionData;
        const section = await prisma.section.create({
          data: {
            ...sectionInfo,
            courseId: course.id,
          },
        });

        // Create videos for the section
        for (const videoData of videos) {
          await prisma.video.create({
            data: {
              ...videoData,
              sectionId: section.id,
            },
          });
        }
      }

      createdCourses.push(course);
      console.log(`Course ${course.name} created successfully with sections and videos`);
    } else {
      createdCourses.push(existingCourse);
      console.log(`Course ${courseData.name} already exists`);
    }
  }

  // Create enrollments
  const enrollments = [
    // John Doe's enrollments
    {
      userId: createdUsers[0].id, // John Doe
      courseId: createdCourses[0].id, // Web Development Bootcamp
      status: EnrollmentStatus.ACTIVE,
    },
    {
      userId: createdUsers[0].id, // John Doe
      courseId: createdCourses[1].id, // Data Science Fundamentals
      status: EnrollmentStatus.COMPLETED,
    },
    // Jane Smith's enrollments
    {
      userId: createdUsers[1].id, // Jane Smith
      courseId: createdCourses[2].id, // Mobile App Development
      status: EnrollmentStatus.ACTIVE,
    },
    {
      userId: createdUsers[1].id, // Jane Smith
      courseId: createdCourses[3].id, // UI/UX Design Masterclass
      status: EnrollmentStatus.EXPIRED,
    },
    // Bob Wilson's enrollments
    {
      userId: createdUsers[2].id, // Bob Wilson
      courseId: createdCourses[4].id, // DevOps Engineering
      status: EnrollmentStatus.ACTIVE,
    },
    {
      userId: createdUsers[2].id, // Bob Wilson
      courseId: createdCourses[0].id, // Web Development Bootcamp
      status: EnrollmentStatus.CANCELLED,
    },
  ];

  for (const enrollmentData of enrollments) {
    const existingEnrollment = await prisma.enrollment.findFirst({
      where: {
        userId: enrollmentData.userId,
        courseId: enrollmentData.courseId,
      },
    });

    if (!existingEnrollment) {
      await prisma.enrollment.create({
        data: enrollmentData,
      });
      console.log(`Enrollment created for user ${enrollmentData.userId} in course ${enrollmentData.courseId}`);
    } else {
      console.log(`Enrollment already exists for user ${enrollmentData.userId} in course ${enrollmentData.courseId}`);
    }
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 