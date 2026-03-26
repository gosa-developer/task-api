import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import {
  getAllCategories,
  createCategory as createCategoryService,
  updateCategory as updateCategoryService,
  deleteCategory as deleteCategoryService,
} from '../services/category.service';

export const getCategories = async (_req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const categories = await getAllCategories();
    return res.json(categories);
  } catch (error) {
    return next(error);
  }
};

export const createCategory = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { name } = req.body;
    const category = await createCategoryService(name);
    return res.status(201).json(category);
  } catch (error) {
    return next(error);
  }
};

export const updateCategory = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const categoryId = Number(req.params['id']);
    const { name } = req.body;
    const category = await updateCategoryService(categoryId, name);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    return res.json(category);
  } catch (error) {
    return next(error);
  }
};

export const deleteCategory = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const categoryId = Number(req.params['id']);
    const deleted = await deleteCategoryService(categoryId);
    if (!deleted) {
      return res.status(404).json({ message: 'Category not found' });
    }
    return res.json({ message: 'Category deleted' });
  } catch (error) {
    return next(error);
  }
};