import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../lib/prisma';
import { config } from '../config';
import { ConflictError, UnauthorizedError } from '../types';

export const registerUser = async (email: string, password: string, name?: string) => {
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    throw new ConflictError('Email already exists');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
    },
  });

  return user;
};

export const loginUser = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new UnauthorizedError('Invalid credentials');
  }

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    throw new UnauthorizedError('Invalid credentials');
  }

  const token = jwt.sign({ id: user.id, email: user.email }, config.jwtSecret, {
    expiresIn: '7d',
  });

  return { token, user };
};