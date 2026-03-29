import { Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err);

  // Prisma errors
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2002') {
      return res.status(409).json({
        message: 'A record with this field already exists',
      });
    }
  }

  // Zod errors are handled in validate middleware, but we can catch others
  res.status(500).json({
    message: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message,
  });
};