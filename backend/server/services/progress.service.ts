import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class ProgressService {
  private static instance: ProgressService;

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

    return prisma.courseProgress.findUnique({
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
          completed: false
        }
      });
    }

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
        courseProgressId: courseProgress.id,
        progress: data.progress,
        lastPosition: data.lastPosition,
        watched: data.progress >= 0.9 // Mark as watched if progress is 90% or more
      },
      update: {
        progress: data.progress,
        lastPosition: data.lastPosition,
        watched: data.progress >= 0.9
      }
    });

    // Calculate overall course progress
    const allVideoProgress = await prisma.videoProgress.findMany({
      where: {
        courseProgressId: courseProgress.id
      }
    });

    const totalVideos = await prisma.video.count({
      where: {
        section: {
          courseId
        }
      }
    });

    const watchedVideos = allVideoProgress.filter((vp: { watched: boolean }) => vp.watched).length;
    const overallProgress = totalVideos > 0 ? (watchedVideos / totalVideos) : 0;
    const completed = overallProgress >= 1;

    // Update course progress
    await prisma.courseProgress.update({
      where: {
        id: courseProgress.id
      },
      data: {
        progress: overallProgress,
        completed
      }
    });

    // Update enrollment status if course is completed
    if (completed) {
      await prisma.enrollment.update({
        where: {
          userId_courseId: {
            userId,
            courseId
          }
        },
        data: {
          status: 'COMPLETED'
        }
      });
    }

    return videoProgress;
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