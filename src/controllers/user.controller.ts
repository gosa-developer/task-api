import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import { getUserProfile, updateUserProfile } from '../services/user.service';

export const getProfile = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const user = await getUserProfile(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    return res.json(user);
  } catch (error) {
    return next(error);
  }
};

export const updateProfile = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const updateData = req.body;
    const user = await updateUserProfile(userId, updateData);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    return res.json(user);
  } catch (error) {
    return next(error);
  }
};