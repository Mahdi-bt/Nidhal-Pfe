import { PrismaClient, type Course, type Section, type Video, type Prisma, type Enrollment } from '@prisma/client';

interface VideoData {
  name: string;
  filePath: string;
  duration: number;
}

interface SectionData {
  name: string;
  videos: VideoData[];
}

interface CourseData {
  name: string;
  description: string;
  price: number;
  level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  category: string;
  duration: number;
  thumbnail?: string;
  sections: SectionData[];
}

interface VideoProgress {
  id: string;
  videoId: string;
  watched: boolean;
  progress: number;
  lastPosition: number;
}

interface SectionWithVideos extends Section {
  videos: Video[];
}

interface CourseWithSections extends Course {
  sections: SectionWithVideos[];
}

interface EnrollmentWithCourse {
  id: string;
  courseId: string;
  status: string;
  enrolledAt: Date;
  course: {
    id: string;
    name: string;
    description: string;
    price: number;
    thumbnail: string | null;
    sections: SectionWithVideos[];
  };
}

type CourseCreateInput = Omit<Prisma.CourseCreateInput, 'level'> & {
  level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
};

type CourseUpdateInput = Omit<Prisma.CourseUpdateInput, 'level'> & {
  level?: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
};

interface CourseProgress {
  overall: number;
  completed: boolean;
  sections: {
    id: string;
    name: string;
    progress: number;
    videoProgress: {
      id: string;
      videoId: string;
      progress: number;
      lastPosition: number;
      watched: boolean;
      createdAt: Date;
      updatedAt: Date;
      name: string;
      duration: number;
      filePath: string | null;
      sectionId: string;
    }[];
  }[];
}

export class CourseService {
  private static instance: CourseService;
  private prisma: PrismaClient;

  private constructor() {
    this.prisma = new PrismaClient();
  }

  public static getInstance(): CourseService {
    if (!CourseService.instance) {
      CourseService.instance = new CourseService();
    }
    return CourseService.instance;
  }

  async createCourse(data: CourseData) {
    const courseData = {
      name: data.name,
      description: data.description,
      price: data.price,
      level: data.level,
      category: data.category,
      duration: data.duration,
      thumbnail: data.thumbnail,
      sections: {
        create: data.sections.map(section => ({
          name: section.name,
          videos: {
            create: section.videos.map(video => ({
              name: video.name,
              filePath: video.filePath,
              duration: video.duration
            }))
          }
        }))
      }
    } as Prisma.CourseCreateInput;

    return this.prisma.course.create({
      data: courseData,
      include: {
        sections: {
          include: {
            videos: true
          }
        }
      }
    });
  }

  async updateCourse(id: string, data: CourseData) {
    // First delete existing sections and videos
    await this.prisma.section.deleteMany({
      where: { courseId: id }
    });

    const courseData = {
      name: data.name,
      description: data.description,
      price: data.price,
      level: data.level,
      category: data.category,
      duration: data.duration,
      thumbnail: data.thumbnail,
      sections: {
        create: data.sections.map(section => ({
          name: section.name,
          videos: {
            create: section.videos.map(video => ({
              name: video.name,
              filePath: video.filePath,
              duration: video.duration
            }))
          }
        }))
      }
    } as Prisma.CourseUpdateInput;

    // Then update the course with new data
    return this.prisma.course.update({
      where: { id },
      data: courseData,
      include: {
        sections: {
          include: {
            videos: true
          }
        }
      }
    });
  }

  async deleteCourse(id: string): Promise<Course> {
    return this.prisma.course.delete({
      where: { id }
    });
  }

  async getCourseById(id: string): Promise<CourseWithSections | null> {
    return this.prisma.course.findUnique({
      where: { id },
      include: {
        sections: {
          include: {
            videos: true
          }
        }
      }
    }) as Promise<CourseWithSections | null>;
  }

  async getAllCourses(): Promise<CourseWithSections[]> {
    return this.prisma.course.findMany({
      include: {
        sections: {
          include: {
            videos: true
          }
        }
      }
    }) as Promise<CourseWithSections[]>;
  }

  async addSection(courseId: string, sectionData: { name: string; videos: { name: string; filePath?: string }[] }) {
    // First check if the course exists
    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
      include: {
        sections: true
      }
    });

    if (!course) {
      throw new Error('Course not found');
    }

    // Add the new section
    return this.prisma.course.update({
      where: { id: courseId },
      data: {
        sections: {
          create: {
            name: sectionData.name,
            videos: {
              create: sectionData.videos.map((video) => ({
                name: video.name,
                filePath: video.filePath
              }))
            }
          }
        }
      },
      include: {
        sections: {
          include: {
            videos: true
          }
        }
      }
    });
  }

  async patchCourse(
    id: string,
    data: {
      name?: string;
      description?: string;
      price?: number;
      sections?: {
        id?: string;
        name?: string;
        videos?: {
          id?: string;
          name?: string;
          filePath?: string;
        }[];
      }[];
    }
  ) {
    // First, get the existing course
    const existingCourse = await this.prisma.course.findUnique({
      where: { id },
      include: {
        sections: {
          include: {
            videos: true
          }
        }
      }
    });

    if (!existingCourse) {
      throw new Error('Course not found');
    }

    // Update basic course information if provided
    const updateData: any = {};
    if (data.name) updateData.name = data.name;
    if (data.description) updateData.description = data.description;
    if (data.price) updateData.price = data.price;

    // Handle section updates if provided
    if (data.sections) {
      // Process each section update
      for (const sectionData of data.sections) {
        if (sectionData.id) {
          // Update existing section
          await this.prisma.section.update({
            where: { id: sectionData.id },
            data: {
              name: sectionData.name,
              // Update videos if provided
              videos: sectionData.videos ? {
                // Delete videos that are not in the update
                deleteMany: {
                  id: {
                    notIn: sectionData.videos
                      .filter(v => v.id)
                      .map(v => v.id as string)
                  }
                },
                // Update or create videos
                upsert: sectionData.videos.map(video => ({
                  where: { id: video.id || 'new' },
                  create: {
                    name: video.name || '',
                    filePath: video.filePath
                  },
                  update: {
                    name: video.name,
                    filePath: video.filePath
                  }
                }))
              } : undefined
            }
          });
        } else {
          // Create new section
          await this.prisma.section.create({
            data: {
              name: sectionData.name || '',
              courseId: id,
              videos: {
                create: sectionData.videos?.map(video => ({
                  name: video.name || '',
                  filePath: video.filePath
                })) || []
              }
            }
          });
        }
      }
    }

    // Return the updated course
    return this.prisma.course.findUnique({
      where: { id },
      include: {
        sections: {
          include: {
            videos: true
          }
        }
      }
    });
  }

  async getEnrolledCourses(userId: string) {
    try {
      console.log('Fetching enrolled courses for user:', userId);
      
      // Get all active enrollments for the user
      const enrollments = await this.prisma.enrollment.findMany({
        where: {
          userId,
          status: 'ACTIVE'
        },
        include: {
          course: {
            include: {
              sections: {
                include: {
                  videos: true
                }
              }
            }
          }
        },
        orderBy: {
          enrolledAt: 'desc'
        }
      });

      console.log('Raw enrollments data:', JSON.stringify(enrollments, null, 2));
      console.log('Found enrollments:', enrollments.length);

      if (enrollments.length === 0) {
        return [];
      }

      // Get progress for each course
      const coursesWithProgress = await Promise.all(
        enrollments.map(async (enrollment) => {
          console.log('Processing enrollment:', enrollment.id, 'for course:', enrollment.courseId);
          
          if (!enrollment.course) {
            console.error('Course not found for enrollment:', enrollment.id);
            return null;
          }

          const courseProgress = await this.prisma.courseProgress.findUnique({
            where: {
              userId_courseId: {
                userId,
                courseId: enrollment.courseId
              }
            },
            include: {
              videoProgress: true
            }
          });

          console.log('Course progress for enrollment:', enrollment.id, courseProgress);

          // Calculate progress for each section
          const sectionsWithProgress = enrollment.course.sections.map((section) => {
            const sectionVideos = section.videos;
            const videoProgress = courseProgress?.videoProgress.filter(
              (vp) => sectionVideos.some((v) => v.id === vp.videoId)
            ) || [];

            const watchedVideos = videoProgress.filter((vp) => vp.watched).length;
            const sectionProgress = sectionVideos.length > 0 
              ? (watchedVideos / sectionVideos.length) 
              : 0;

            return {
              ...section,
              progress: sectionProgress,
              videoProgress: videoProgress
            };
          });

          // Calculate overall course progress
          const totalVideos = enrollment.course.sections.reduce(
            (sum, section) => sum + section.videos.length, 
            0
          );
          const watchedVideos = courseProgress?.videoProgress.filter((vp) => vp.watched).length || 0;
          const overallProgress = totalVideos > 0 ? (watchedVideos / totalVideos) : 0;

          const courseWithProgress = {
            ...enrollment.course,
            enrollment: {
              id: enrollment.id,
              status: enrollment.status,
              enrolledAt: enrollment.enrolledAt
            },
            progress: {
              overall: overallProgress,
              completed: courseProgress?.completed || false,
              sections: sectionsWithProgress
            }
          };

          console.log('Processed course with progress:', courseWithProgress.id);
          return courseWithProgress;
        })
      );

      // Filter out any null values and return the courses
      const validCourses = coursesWithProgress.filter((course): course is NonNullable<typeof course> => course !== null);
      console.log('Final courses count:', validCourses.length);
      return validCourses;
    } catch (error) {
      console.error('Error in getEnrolledCourses:', error);
      throw new Error('Failed to fetch enrolled courses');
    }
  }

  async getEnrolledCourse(userId: string, courseId: string) {
    // Get the enrollment
    const enrollment = await this.prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId
        }
      },
      include: {
        course: {
          include: {
            sections: {
              include: {
                videos: true
              }
            }
          }
        }
      }
    });

    if (!enrollment) {
      throw new Error('Course not found or user is not enrolled');
    }

    // Get course progress
    const courseProgress = await this.prisma.courseProgress.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId
        }
      },
      include: {
        videoProgress: true
      }
    });

    // Calculate progress for each section
    const sectionsWithProgress = enrollment.course.sections.map((section: SectionWithVideos) => {
      const sectionVideos = section.videos;
      const videoProgress = courseProgress?.videoProgress.filter(
        (vp: VideoProgress) => sectionVideos.some(v => v.id === vp.videoId)
      ) || [];

      const watchedVideos = videoProgress.filter((vp: VideoProgress) => vp.watched).length;
      const sectionProgress = sectionVideos.length > 0 
        ? (watchedVideos / sectionVideos.length) 
        : 0;

      return {
        ...section,
        progress: sectionProgress,
        videoProgress: videoProgress
      };
    });

    // Calculate overall course progress
    const totalVideos = enrollment.course.sections.reduce(
      (sum: number, section: SectionWithVideos) => sum + section.videos.length, 
      0
    );
    const watchedVideos = courseProgress?.videoProgress.filter((vp: VideoProgress) => vp.watched).length || 0;
    const overallProgress = totalVideos > 0 ? (watchedVideos / totalVideos) : 0;

    return {
      ...enrollment.course,
      enrollment: {
        id: enrollment.id,
        status: enrollment.status,
        enrolledAt: enrollment.enrolledAt
      },
      progress: {
        overall: overallProgress,
        completed: courseProgress?.completed || false,
        sections: sectionsWithProgress
      }
    };
  }

  async getCourseProgress(userId: string, courseId: string): Promise<CourseProgress> {
    const course = await this.getCourseById(courseId);
    if (!course) {
      throw new Error('Course not found');
    }

    const videoProgress = await this.prisma.videoProgress.findMany({
      where: {
        userId,
        courseId
      }
    });

    const sections = course.sections.map(section => {
      const sectionVideos = section.videos.map(video => {
        const progress = videoProgress.find(vp => vp.videoId === video.id);
        return {
          id: video.id,
          videoId: video.id,
          name: video.name,
          duration: video.duration,
          filePath: video.filePath,
          sectionId: video.sectionId,
          progress: progress?.progress || 0,
          lastPosition: progress?.lastPosition || 0,
          watched: progress?.watched || false,
          createdAt: video.createdAt,
          updatedAt: video.updatedAt
        };
      });

      const sectionProgress = sectionVideos.reduce((sum, video) => sum + video.progress, 0) / sectionVideos.length;

      return {
        id: section.id,
        name: section.name,
        progress: sectionProgress,
        videoProgress: sectionVideos
      };
    });

    const overallProgress = sections.reduce((sum, section) => sum + section.progress, 0) / sections.length;
    const completed = sections.every(section => section.progress === 100);

    return {
      overall: overallProgress,
      completed,
      sections
    };
  }

  async isUserEnrolled(userId: string, courseId: string): Promise<boolean> {
    const enrollment = await this.prisma.enrollment.findFirst({
      where: {
        userId,
        courseId,
        status: 'ACTIVE'
      }
    });
    return !!enrollment;
  }

  async createEnrollment(userId: string, courseId: string): Promise<Enrollment> {
    console.log('Creating enrollment:', { userId, courseId });
    
    try {
      // Check if enrollment already exists
      const existingEnrollment = await this.prisma.enrollment.findFirst({
        where: {
          userId,
          courseId,
          status: 'ACTIVE'
        }
      });

      if (existingEnrollment) {
        console.log('Enrollment already exists:', existingEnrollment);
        return existingEnrollment;
      }

      // Create new enrollment
      const enrollment = await this.prisma.enrollment.create({
        data: {
          userId,
          courseId,
          status: 'ACTIVE',
          enrolledAt: new Date()
        }
      });

      console.log('Enrollment created successfully:', enrollment);
      return enrollment;
    } catch (error) {
      console.error('Error creating enrollment:', error);
      throw new Error('Failed to create enrollment');
    }
  }

  async initializeCourseProgress(userId: string, courseId: string) {
    console.log('Initializing course progress:', { userId, courseId });
    
    try {
      // Check if progress already exists
      const existingProgress = await this.prisma.courseProgress.findUnique({
        where: {
          userId_courseId: {
            userId,
            courseId
          }
        }
      });

      if (existingProgress) {
        console.log('Course progress already exists:', existingProgress);
        return existingProgress;
      }

      // Create new course progress
      const courseProgress = await this.prisma.courseProgress.create({
        data: {
          userId,
          courseId,
          progress: 0,
          completed: false
        }
      });

      console.log('Course progress created successfully:', courseProgress);
      return courseProgress;
    } catch (error) {
      console.error('Error initializing course progress:', error);
      throw new Error('Failed to initialize course progress');
    }
  }

  async updateVideoProgress(
    userId: string,
    courseId: string,
    videoId: string,
    progress: number,
    lastPosition: number
  ): Promise<VideoProgress> {
    const watched = progress >= 90; // Consider video watched if progress is 90% or more

    // Get or create course progress
    const courseProgress = await this.prisma.courseProgress.upsert({
      where: {
        userId_courseId: {
          userId,
          courseId
        }
      },
      update: {},
      create: {
        userId,
        courseId,
        progress: 0,
        completed: false
      }
    });

    // Update video progress
    const videoProgress = await this.prisma.videoProgress.upsert({
      where: {
        userId_videoId: {
          userId,
          videoId
        }
      },
      update: {
        progress,
        lastPosition,
        watched,
        updatedAt: new Date()
      },
      create: {
        userId,
        videoId,
        courseId,
        courseProgressId: courseProgress.id,
        progress,
        lastPosition,
        watched,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    });

    // Update course progress
    const updatedCourseProgress = await this.getCourseProgress(userId, courseId);
    await this.prisma.courseProgress.update({
      where: {
        id: courseProgress.id
      },
      data: {
        progress: updatedCourseProgress.overall,
        completed: updatedCourseProgress.completed,
        updatedAt: new Date()
      }
    });

    return videoProgress;
  }
} 