import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import {
  getTasksForUser,
  getTaskByIdForUser,
  createTaskForUser,
  updateTaskForUser,
  deleteTaskForUser,
} from '../services/task.service';

export const getTasks = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const filters: {
      status?: string;
      priority?: string;
      categoryId?: number;
      search?: string;
      page: number;
      limit: number;
    } = {
      page: req.query['page'] ? Number(req.query['page']) : 1,
      limit: req.query['limit'] ? Number(req.query['limit']) : 10,
    };
    
    if (req.query['status']) {
      filters.status = req.query['status'] as string;
    }
    if (req.query['priority']) {
      filters.priority = req.query['priority'] as string;
    }
    if (req.query['categoryId']) {
      filters.categoryId = Number(req.query['categoryId']);
    }
    if (req.query['search']) {
      filters.search = req.query['search'] as string;
    }
    
    const result = await getTasksForUser(userId, filters);
    return res.json(result);
  } catch (error) {
    return next(error);
  }
};

export const getTaskById = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const taskId = Number(req.params['id']);
    const task = await getTaskByIdForUser(userId, taskId);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    return res.json(task);
  } catch (error) {
    return next(error);
  }
};

export const createTask = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const taskData = req.body;
    const task = await createTaskForUser(userId, taskData);
    return res.status(201).json(task);
  } catch (error) {
    return next(error);
  }
};

export const updateTask = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const taskId = Number(req.params['id']);
    const taskData = req.body;
    const task = await updateTaskForUser(userId, taskId, taskData);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    return res.json(task);
  } catch (error) {
    return next(error);
  }
};

export const deleteTask = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const taskId = Number(req.params['id']);
    const deleted = await deleteTaskForUser(userId, taskId);
    if (!deleted) {
      return res.status(404).json({ message: 'Task not found' });
    }
    return res.json({ message: 'Task deleted' });
  } catch (error) {
    return next(error);
  }
};