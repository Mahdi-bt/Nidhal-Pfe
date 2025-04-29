import { Router } from 'express';
import { UserService } from '../services/user.service';
import { authMiddleware, adminMiddleware } from '../middleware/auth.middleware';

const router = Router();
const userService = UserService.getInstance();

// Define UserStatus enum
enum UserStatus {
  ACTIVE = 'ACTIVE',
  BLOCKED = 'BLOCKED'
}

// Get user profile
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }
    const userId = req.user.id;
    const profile = await userService.getProfile(userId);
    res.json(profile);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});

// Update user profile
router.put('/profile', authMiddleware, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }
    const userId = req.user.id;
    const updatedProfile = await userService.updateProfile(userId, req.body);
    res.json(updatedProfile);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});

// Admin routes
// Get all users
router.get('/', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    res.json(users);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});

// Get user by ID
router.get('/:userId', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await userService.getUserById(userId);
    res.json(user);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});

// Update user status (block/unblock)
router.patch('/:userId/status', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { userId } = req.params;
    const { status } = req.body;

    if (!Object.values(UserStatus).includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const updatedUser = await userService.updateUserStatus(userId, status);
    res.json(updatedUser);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});

// Delete user
router.delete('/:userId', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { userId } = req.params;
    await userService.deleteUser(userId);
    res.status(204).send();
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});

export default router; 