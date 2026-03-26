import { z } from 'zod';

const statusEnum = z.enum(['pending', 'in_progress', 'completed']);
const priorityEnum = z.enum(['low', 'medium', 'high']);

export const createTaskSchema = z.object({
  body: z.object({
    title: z.string().min(1),
    description: z.string().optional(),
    status: statusEnum.optional(),
    priority: priorityEnum.optional(),
    dueDate: z.string().datetime().optional(),
    categoryId: z.number().int().positive().optional(),
  }),
});

export const updateTaskSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/).transform(Number),
  }),
  body: z.object({
    title: z.string().min(1).optional(),
    description: z.string().optional(),
    status: statusEnum.optional(),
    priority: priorityEnum.optional(),
    dueDate: z.string().datetime().optional(),
    categoryId: z.number().int().positive().optional(),
  }),
});

export const taskQuerySchema = z.object({
  query: z.object({
    status: statusEnum.optional(),
    priority: priorityEnum.optional(),
    categoryId: z.string().regex(/^\d+$/).transform(Number).optional(),
    search: z.string().optional(),
    page: z.string().regex(/^\d+$/).transform(Number).optional(),
    limit: z.string().regex(/^\d+$/).transform(Number).optional(),
  }),
});