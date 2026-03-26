import prisma from '../lib/prisma';

export const getAllCategories = async () => {
  return prisma.category.findMany({
    orderBy: { name: 'asc' },
  });
};

export const createCategory = async (name: string) => {
  return prisma.category.create({
    data: { name },
  });
};

export const updateCategory = async (categoryId: number, name: string) => {
  const existing = await prisma.category.findUnique({ where: { id: categoryId } });
  if (!existing) return null;

  return prisma.category.update({
    where: { id: categoryId },
    data: { name },
  });
};

export const deleteCategory = async (categoryId: number) => {
  const existing = await prisma.category.findUnique({ where: { id: categoryId } });
  if (!existing) return false;

  // Optionally, you can set tasks' categoryId to null or handle relation
  await prisma.category.delete({ where: { id: categoryId } });
  return true;
};