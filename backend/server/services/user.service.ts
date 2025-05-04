import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

// Define UserStatus enum
enum UserStatus {
  ACTIVE = 'ACTIVE',
  BLOCKED = 'BLOCKED'
}

export class UserService {
  private static instance: UserService;

  private constructor() {}

  public static getInstance(): UserService {
    if (!UserService.instance) {
      UserService.instance = new UserService();
    }
    return UserService.instance;
  }

  async updateProfile(userId: string, data: {
    name?: string;
    email?: string;
    currentPassword?: string;
    newPassword?: string;
  }) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId }
      });

      if (!user) {
        throw new Error('User not found');
      }

      const updateData: any = {};

      // Update name if provided
      if (data.name) {
        updateData.name = data.name;
      }

      // Update email if provided
      if (data.email) {
        // Check if email is already taken
        const existingUser = await prisma.user.findUnique({
          where: { email: data.email }
        });

        if (existingUser && existingUser.id !== userId) {
          throw new Error('Email already taken');
        }

        updateData.email = data.email;
      }

      // Update password if provided
      if (data.newPassword) {
        if (!data.currentPassword) {
          throw new Error('Current password is required to set new password');
        }

        // Verify current password
        const isValidPassword = await bcrypt.compare(data.currentPassword, user.password);
        if (!isValidPassword) {
          throw new Error('Current password is incorrect');
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(data.newPassword, 10);
        updateData.password = hashedPassword;
      }

      // Update user
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: updateData,
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          status: true,
          createdAt: true,
          updatedAt: true
        }
      });

      return updatedUser;
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  }

  async getProfile(userId: string) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          status: true,
          createdAt: true,
          updatedAt: true
        }
      });

      if (!user) {
        throw new Error('User not found');
      }

      return user;
    } catch (error) {
      console.error('Error getting user profile:', error);
      throw error;
    }
  }

  async editProfile(userId: string, data: {
    name?: string;
    email?: string;
    currentPassword?: string;
    newPassword?: string;
  }) {
    return this.updateProfile(userId, data);
  }

  // Admin functions
  async getAllUsers() {
    try {
      const users = await prisma.user.findMany({
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          status: true,
          createdAt: true,
          updatedAt: true
        },
        orderBy: {
          createdAt: 'desc'
        }
      });

      return users;
    } catch (error) {
      console.error('Error getting all users:', error);
      throw new Error('Failed to get all users');
    }
  }

  async getUserById(userId: string) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          status: true,
          createdAt: true,
          updatedAt: true
        }
      });

      if (!user) {
        throw new Error('User not found');
      }

      return user;
    } catch (error) {
      console.error('Error getting user:', error);
      throw new Error('Failed to get user');
    }
  }

  async updateUserStatus(userId: string, status: UserStatus) {
    try {
      const user = await prisma.user.update({
        where: { id: userId },
        data: { status },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          status: true,
          createdAt: true,
          updatedAt: true
        }
      });

      return user;
    } catch (error) {
      console.error('Error updating user status:', error);
      throw new Error('Failed to update user status');
    }
  }

  async deleteUser(userId: string) {
    try {
      await prisma.user.delete({
        where: { id: userId }
      });
    } catch (error) {
      console.error('Error deleting user:', error);
      throw new Error('Failed to delete user');
    }
  }
} 