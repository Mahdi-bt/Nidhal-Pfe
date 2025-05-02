import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class ProgressService {
  private static instance: ProgressService;
  private readonly WATCHED_THRESHOLD = 90; // 90% watched to mark as completed

  private constructor() {}

  public static getInstance(): ProgressService {
    if (!ProgressService.instance) {
      ProgressService.instance = new ProgressService();
    }
    return ProgressService.instance;
  }

  async getCourseProgress(userId: string, courseId: string) {
    // Check if user is enrolled in the course
    const enrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId
        }
      }
    });

    if (!enrollment) {
      throw new Error('You are not enrolled in this course');
    }

    // Get course progress with sections and videos
    const courseProgress = await prisma.courseProgress.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId
        }
      },
      include: {
        videoProgress: {
          include: {
            video: {
              include: {
                section: true
              }
            }
          }
        }
      }
    });

    if (!courseProgress) {
      return null;
    }

    // Get course sections with videos
    const sections = await prisma.section.findMany({
      where: {
        courseId
      },
      include: {
        videos: true
      }
    });

    // Calculate section progress
    const sectionsWithProgress = sections.map(section => {
      const sectionVideos = section.videos;
      const sectionProgress = courseProgress.videoProgress.filter(vp => 
        sectionVideos.some(v => v.id === vp.videoId)
      );

      const sectionWatchedVideos = sectionProgress.filter(vp => vp.watched).length;
      const sectionProgressPercentage = sectionVideos.length > 0 
        ? (sectionWatchedVideos / sectionVideos.length) * 100 
        : 0;

      return {
        id: section.id,
        name: section.name,
        progress: sectionProgressPercentage,
        videoProgress: sectionProgress.map(vp => ({
          id: vp.id,
          videoId: vp.videoId,
          watched: vp.watched,
          progress: vp.progress,
          lastPosition: vp.lastPosition
        }))
      };
    });

    // Calculate overall progress
    const overallProgress = sectionsWithProgress.length > 0
      ? sectionsWithProgress.reduce((acc, section) => acc + section.progress, 0) / sectionsWithProgress.length
      : 0;

    return {
      ...courseProgress,
      overall: overallProgress,
      sections: sectionsWithProgress
    };
  }

  async getAllUserProgress(userId: string) {
    // Get only enrolled courses
    const enrollments = await prisma.enrollment.findMany({
      where: {
        userId,
        status: 'ACTIVE'
      },
      include: {
        course: true
      }
    });

    const courseIds = enrollments.map((e: { courseId: string }) => e.courseId);

    return prisma.courseProgress.findMany({
      where: {
        userId,
        courseId: {
          in: courseIds
        }
      },
      include: {
        course: true,
        videoProgress: {
          include: {
            video: true
          }
        }
      }
    });
  }

  async updateVideoProgress(userId: string, videoId: string, data: { progress: number; lastPosition: number }) {
    // Get the video to find its course
    const video = await prisma.video.findUnique({
      where: { id: videoId },
      include: {
        section: {
          include: {
            course: true
          }
        }
      }
    });

    if (!video) {
      throw new Error('Video not found');
    }

    const courseId = video.section.courseId;

    // Check if user is enrolled in the course
    const enrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId
        }
      }
    });

    if (!enrollment) {
      throw new Error('You are not enrolled in this course');
    }

    // Get or create course progress
    let courseProgress = await prisma.courseProgress.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId
        }
      }
    });

    if (!courseProgress) {
      courseProgress = await prisma.courseProgress.create({
        data: {
          userId,
          courseId,
          progress: 0,
          completed: false,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      });
    }

    // Calculate watched status based on progress
    const watched = data.progress >= this.WATCHED_THRESHOLD;

    // Update video progress
    const videoProgress = await prisma.videoProgress.upsert({
      where: {
        userId_videoId: {
          userId,
          videoId
        }
      },
      create: {
        userId,
        videoId,
        courseId,
        courseProgressId: courseProgress.id,
        progress: data.progress,
        lastPosition: data.lastPosition,
        watched,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      update: {
        progress: data.progress,
        lastPosition: data.lastPosition,
        watched,
        updatedAt: new Date()
      }
    });

    // Get updated course progress
    const updatedProgress = await this.getCourseProgress(userId, courseId);
    
    if (!updatedProgress) {
      throw new Error('Failed to update course progress');
    }

    // Update course progress
    await prisma.courseProgress.update({
      where: {
        id: courseProgress.id
      },
      data: {
        progress: updatedProgress.overall,
        completed: updatedProgress.overall >= this.WATCHED_THRESHOLD,
        updatedAt: new Date()
      }
    });

    // Update enrollment status if course is completed
    if (updatedProgress.overall >= this.WATCHED_THRESHOLD) {
      await prisma.enrollment.update({
        where: {
          userId_courseId: {
            userId,
            courseId
          }
        },
        data: {
          status: 'COMPLETED',
          updatedAt: new Date()
        }
      });
    }

    return {
      videoProgress,
      courseProgress: updatedProgress
    };
  }

  async resetProgress(userId: string, courseId: string) {
    // Check if user is enrolled in the course
    const enrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId
        }
      }
    });

    if (!enrollment) {
      throw new Error('You are not enrolled in this course');
    }

    // Delete all video progress for this course
    await prisma.videoProgress.deleteMany({
      where: {
        userId,
        courseProgress: {
          courseId
        }
      }
    });

    // Delete course progress
    return prisma.courseProgress.delete({
      where: {
        userId_courseId: {
          userId,
          courseId
        }
      }
    });
  }
} 