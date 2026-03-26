import prisma from '../lib/prisma';

export const getUserProfile = async (userId: number) => {
  return prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, email: true, name: true, createdAt: true, updatedAt: true },
  });
};

export const updateUserProfile = async (userId: number, data: { name?: string; email?: string }) => {
  // Check if email is taken by another user
  if (data.email) {
    const existing = await prisma.user.findFirst({
      where: { email: data.email, NOT: { id: userId } },
    });
    if (existing) {
      throw new Error('Email already in use');
    }
  }

  return prisma.user.update({
    where: { id: userId },
    data,
    select: { id: true, email: true, name: true, createdAt: true, updatedAt: true },
  });
};