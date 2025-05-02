import { Router, Request } from 'express';
import { ProgressService } from '../services/progress.service';
import { authMiddleware } from '../middleware/auth.middleware';

interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

const router = Router();
const progressService = ProgressService.getInstance();

// Get progress for a specific course
router.get('/courses/:courseId', authMiddleware, async (req: AuthRequest, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const progress = await progressService.getCourseProgress(req.user.id, req.params.courseId);
    res.json(progress || { progress: 0, completed: false, videoProgress: [] });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});

// Get all progress for the current user
router.get('/', authMiddleware, async (req: AuthRequest, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const progress = await progressService.getAllUserProgress(req.user.id);
    res.json(progress);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});

// Update video progress
router.put('/video/:videoId', authMiddleware, async (req: AuthRequest, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const { progress, lastPosition } = req.body;
    const videoProgress = await progressService.updateVideoProgress(
      req.user.id,
      req.params.videoId,
      { progress, lastPosition }
    );
    res.json(videoProgress);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});

// Reset progress for a course
router.delete('/courses/:courseId', authMiddleware, async (req: AuthRequest, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    await progressService.resetProgress(req.user.id, req.params.courseId);
    res.status(204).send();
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});

export default router; 