export const config = {
  port: process.env.PORT || 3000,
  jwtSecret: process.env.JWT_SECRET || 'default-secret-change-me',
  nodeEnv: process.env.NODE_ENV || 'development',
};