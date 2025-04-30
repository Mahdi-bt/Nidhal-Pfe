import { PrismaClient, type Course, type Section, type Video, type Prisma } from '@prisma/client';

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
      }
    });

    // Get progress for each course
    const coursesWithProgress = await Promise.all(
      enrollments.map(async (enrollment) => {
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

        // Calculate progress for each section
        const sectionsWithProgress = enrollment.course.sections.map((section) => {
          const sectionVideos = section.videos;
          const videoProgress = courseProgress?.videoProgress.filter(
            (vp) => sectionVideos.some(v => v.id === vp.videoId)
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
      })
    );

    return coursesWithProgress;
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

  async getCourseProgress(userId: string, courseId: string) {
    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
      include: {
        sections: {
          include: {
            videos: true
          }
        }
      }
    });

    if (!course) {
      throw new Error('Course not found');
    }

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

    if (!courseProgress) {
      return {
        courseId,
        userId,
        progress: 0,
        completed: false,
        sections: course.sections.map(section => ({
          id: section.id,
          name: section.name,
          progress: 0,
          videoProgress: []
        }))
      };
    }

    const sections = course.sections.map(section => {
      const sectionVideoProgress = section.videos.map(video => {
        const progress = courseProgress.videoProgress.find(vp => vp.videoId === video.id);
        return {
          id: video.id,
          name: video.name,
          progress: progress ? progress.progress : 0,
          watched: progress ? progress.watched : false,
          lastPosition: progress ? progress.lastPosition : 0
        };
      });

      const sectionProgress = sectionVideoProgress.length > 0
        ? sectionVideoProgress.reduce((sum, video) => sum + video.progress, 0) / sectionVideoProgress.length
        : 0;

      return {
        id: section.id,
        name: section.name,
        progress: sectionProgress,
        videoProgress: sectionVideoProgress
      };
    });

    const totalProgress = sections.length > 0
      ? sections.reduce((sum, section) => sum + section.progress, 0) / sections.length
      : 0;

    return {
      courseId,
      userId,
      progress: totalProgress,
      completed: totalProgress >= 100,
      sections
    };
  }
} 