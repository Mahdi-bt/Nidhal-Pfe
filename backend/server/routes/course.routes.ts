import { Router } from 'express';
import { CourseService } from '../services/course.service';
import { authMiddleware, adminMiddleware } from '../middleware/auth.middleware';
import { upload, uploadImage, uploadVideo } from '../config/upload.config';
import path from 'path';

const router = Router();
const courseService = CourseService.getInstance();

// Get enrolled courses for a user
router.get('/enrolled', authMiddleware, async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }
    const courses = await courseService.getEnrolledCourses(userId);
    res.json(courses);
  } catch (error: any) {
    console.error('Error fetching enrolled courses:', error);
    res.status(400).json({ message: error.message });
  }
});

// Get course progress
router.get('/:courseId/progress', authMiddleware, async (req, res) => {
  try {
    const userId = req.user?.id;
    const { courseId } = req.params;
    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }
    const progress = await courseService.getCourseProgress(userId, courseId);
    res.json(progress);
  } catch (error: any) {
    console.error('Error fetching course progress:', error);
    res.status(400).json({ message: error.message });
  }
});

// Get course learning data
router.get('/:courseId/learn', authMiddleware, async (req, res) => {
  try {
    const userId = req.user?.id;
    const { courseId } = req.params;
    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }
    const courseData = await courseService.getEnrolledCourse(userId, courseId);
    res.json(courseData);
  } catch (error: any) {
    console.error('Error fetching course learning data:', error);
    res.status(400).json({ message: error.message });
  }
});

// Update video progress
router.post('/:courseId/videos/:videoId/progress', authMiddleware, async (req, res) => {
  try {
    const userId = req.user?.id;
    const { courseId, videoId } = req.params;
    const { progress, lastPosition } = req.body;
    
    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const videoProgress = await courseService.updateVideoProgress(
      userId,
      courseId,
      videoId,
      progress,
      lastPosition
    );
    res.json(videoProgress);
  } catch (error: any) {
    console.error('Error updating video progress:', error);
    res.status(400).json({ message: error.message });
  }
});

// Create a new course (admin only)
router.post('/', authMiddleware, adminMiddleware, upload.any(), async (req, res) => {
  try {
    const courseData = JSON.parse(req.body.course);
    const files = req.files as Express.Multer.File[];
    
    // Add thumbnail path if provided
    const thumbnailFile = files.find(file => file.fieldname === 'thumbnail');
    if (thumbnailFile) {
      const thumbnailFileName = thumbnailFile.path.split(path.sep).pop();
      courseData.thumbnail = `uploads/${thumbnailFileName}`;
    }
    
    // Add file paths to the course data
    if (courseData.sections) {
      courseData.sections = courseData.sections.map((section: any, sectionIndex: number) => {
        return {
          ...section,
          videos: section.videos.map((video: any, videoIndex: number) => {
            const videoField = `videos[${sectionIndex}][${videoIndex}]`;
            const videoFile = files.find(file => file.fieldname === videoField);
            if (!videoFile?.path) return { ...video, filePath: video.filePath };
            const videoFileName = videoFile.path.split(path.sep).pop();
            return {
              ...video,
              filePath: `uploads/${videoFileName}`,
              duration: video.duration
            };
          })
        };
      });
    }

    const course = await courseService.createCourse(courseData);
    res.status(201).json(course);
  } catch (error: any) {
    console.error('Error creating course:', error);
    res.status(400).json({ message: error.message });
  }
});

// Update a course (admin only)
router.put('/:id', authMiddleware, adminMiddleware, upload.any(), async (req, res) => {
  try {
    const courseId = req.params.id;
    const courseData = JSON.parse(req.body.course);
    const files = req.files as Express.Multer.File[];
    
    // Add thumbnail path if provided
    const thumbnailFile = files.find(file => file.fieldname === 'thumbnail');
    if (thumbnailFile) {
      const thumbnailFileName = thumbnailFile.path.split(path.sep).pop();
      courseData.thumbnail = `uploads/${thumbnailFileName}`;
    }
    
    // Add file paths to the course data
    if (courseData.sections) {
      courseData.sections = courseData.sections.map((section: any, sectionIndex: number) => {
        return {
          ...section,
          videos: section.videos.map((video: any, videoIndex: number) => {
            const videoField = `videos[${sectionIndex}][${videoIndex}]`;
            const videoFile = files.find(file => file.fieldname === videoField);
            if (!videoFile?.path) return { ...video, filePath: video.filePath };
            const videoFileName = videoFile.path.split(path.sep).pop();
            return {
              ...video,
              filePath: `uploads/${videoFileName}`,
              duration: video.duration
            };
          })
        };
      });
    }

    const course = await courseService.updateCourse(courseId, courseData);
    res.json(course);
  } catch (error: any) {
    console.error('Error updating course:', error);
    res.status(400).json({ message: error.message });
  }
});

// Delete a course (admin only)
router.delete('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    await courseService.deleteCourse(req.params.id);
    res.status(204).send();
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});

// Get a specific course
router.get('/:id', async (req, res) => {
  try {
    const course = await courseService.getCourseById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.json(course);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});

// Get all courses
router.get('/', async (req, res) => {
  try {
    const courses = await courseService.getAllCourses();
    res.json(courses);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});

// Add a section to a course (admin only)
router.post('/:courseId/sections', authMiddleware, adminMiddleware, uploadVideo.array('videos', 10), async (req, res) => {
  try {
    const courseId = req.params.courseId;
    const sectionData = JSON.parse(req.body.section);
    const files = req.files as Express.Multer.File[];
    
    // Add file paths to the section data
    if (files && files.length > 0) {
      sectionData.videos = sectionData.videos.map((video: any, index: number) => ({
        ...video,
        filePath: files[index]?.path
      }));
    }

    const course = await courseService.addSection(courseId, sectionData);
    res.status(201).json(course);
  } catch (error: any) {
    console.error('Error adding section:', error);
    res.status(400).json({ message: error.message });
  }
});

// Patch a course (admin only)
router.patch('/:id', authMiddleware, adminMiddleware, uploadVideo.array('videos', 10), async (req, res) => {
  try {
    const courseId = req.params.id;
    const courseData = JSON.parse(req.body.course);
    const files = req.files as Express.Multer.File[];
    
    // Add file paths to the course data if files are provided
    if (files && files.length > 0) {
      // Handle section updates with videos
      if (courseData.sections) {
        courseData.sections = courseData.sections.map((section: any, index: number) => {
          if (section.videos) {
            const sectionFiles = files.filter(file => file.fieldname === `videos[${index}]`);
            return {
              ...section,
              videos: section.videos.map((video: any, videoIndex: number) => {
                if (!sectionFiles[videoIndex]?.path) return { ...video, filePath: null };
                const videoFileName = sectionFiles[videoIndex].path.split(path.sep).pop();
                return {
                  ...video,
                  filePath: `uploads/${videoFileName}`
                };
              })
            };
          }
          return section;
        });
      }
    }

    const course = await courseService.patchCourse(courseId, courseData);
    res.json(course);
  } catch (error: any) {
    console.error('Error patching course:', error);
    res.status(400).json({ message: error.message });
  }
});

export default router; 