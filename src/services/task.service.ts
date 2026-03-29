import { Prisma } from '@prisma/client';
import prisma from '../lib/prisma';

interface TaskFilters {
  status?: string;
  priority?: string;
  categoryId?: number;
  search?: string;
  page?: number;
  limit?: number;
}

export const getTasksForUser = async (userId: number, filters: TaskFilters) => {
  const { status, priority, categoryId, search, page = 1, limit = 10 } = filters;
  const skip = (page - 1) * limit;

  const where: Prisma.TaskWhereInput = {
    userId,
    ...(status && { status: status as any }),
    ...(priority && { priority: priority as any }),
    ...(categoryId && { categoryId }),
    ...(search && {
      OR: [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ],
    }),
  };

  const [tasks, total] = await Promise.all([
    prisma.task.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: { category: true },
    }),
    prisma.task.count({ where }),
  ]);

  return {
    tasks,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
};

export const getTaskByIdForUser = async (userId: number, taskId: number) => {
  return prisma.task.findFirst({
    where: { id: taskId, userId },
    include: { category: true },
  });
};

export const createTaskForUser = async (userId: number, taskData: any) => {
  return prisma.task.create({
    data: {
      ...taskData,
      userId,
    },
    include: { category: true },
  });
};

export const updateTaskForUser = async (userId: number, taskId: number, taskData: any) => {
  const existing = await prisma.task.findFirst({ where: { id: taskId, userId } });
  if (!existing) return null;

  return prisma.task.update({
    where: { id: taskId },
    data: taskData,
    include: { category: true },
  });
};

export const deleteTaskForUser = async (userId: number, taskId: number) => {
  const existing = await prisma.task.findFirst({ where: { id: taskId, userId } });
  if (!existing) return false;

  await prisma.task.delete({ where: { id: taskId } });
  return true;
};