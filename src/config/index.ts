import dotenv from 'dotenv';

dotenv.config();

export const config = {
  jwtSecret: process.env['JWT_SECRET']!,
  port: parseInt(process.env['PORT'] || '3000', 10),
  nodeEnv: process.env['NODE_ENV'] || 'development',
};