import { Router } from 'express';
import { CourseService } from '../services/course.service';
import { authMiddleware, adminMiddleware } from '../middleware/auth.middleware';
import { upload, uploadImage, uploadVideo } from '../config/upload.config';

const router = Router();
const courseService = CourseService.getInstance();

// Create a new course (admin only)
router.post('/', authMiddleware, adminMiddleware, upload.fields([
  { name: 'thumbnail', maxCount: 1 },
  { name: 'videos[0]', maxCount: 10 },
  { name: 'videos[1]', maxCount: 10 },
  { name: 'videos[2]', maxCount: 10 },
  { name: 'videos[3]', maxCount: 10 },
  { name: 'videos[4]', maxCount: 10 }
]), async (req, res) => {
  try {
    const courseData = JSON.parse(req.body.course);
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    
    // Add thumbnail path if provided
    if (files.thumbnail && files.thumbnail.length > 0) {
      courseData.thumbnail = files.thumbnail[0].path.replace(/\\/g, '/');
    }
    
    // Add file paths to the course data
    if (courseData.sections) {
      courseData.sections = courseData.sections.map((section: any, index: number) => {
        const sectionFiles = files[`videos[${index}]`] || [];
        return {
          ...section,
          videos: section.videos.map((video: any, videoIndex: number) => ({
            ...video,
            filePath: sectionFiles[videoIndex]?.path?.replace(/\\/g, '/'),
            duration: video.duration
          }))
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
router.put('/:id', authMiddleware, adminMiddleware, upload.fields([
  { name: 'thumbnail', maxCount: 1 },
  { name: 'videos[0]', maxCount: 10 },
  { name: 'videos[1]', maxCount: 10 },
  { name: 'videos[2]', maxCount: 10 },
  { name: 'videos[3]', maxCount: 10 },
  { name: 'videos[4]', maxCount: 10 }
]), async (req, res) => {
  try {
    const courseId = req.params.id;
    const courseData = JSON.parse(req.body.course);
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    
    // Add thumbnail path if provided
    if (files.thumbnail && files.thumbnail.length > 0) {
      courseData.thumbnail = files.thumbnail[0].path.replace(/\\/g, '/');
    }
    
    // Add file paths to the course data
    if (courseData.sections) {
      courseData.sections = courseData.sections.map((section: any, index: number) => {
        const sectionFiles = files[`videos[${index}]`] || [];
        return {
          ...section,
          videos: section.videos.map((video: any, videoIndex: number) => ({
            ...video,
            filePath: sectionFiles[videoIndex]?.path?.replace(/\\/g, '/'),
            duration: video.duration
          }))
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
              videos: section.videos.map((video: any, videoIndex: number) => ({
                ...video,
                filePath: sectionFiles[videoIndex]?.path
              }))
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