import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { config } from '../config';

// Define your custom JWT payload interface
export interface UserPayload {
  id: number;
  email: string;
  iat?: number;
  exp?: number;
}

// Extend Express Request to include user property
export interface AuthRequest extends Request {
  user?: UserPayload;
}

// Type guard to safely check if decoded token matches UserPayload
const isUserPayload = (payload: string | JwtPayload): payload is UserPayload => {
  return (
    typeof payload === 'object' &&
    payload !== null &&
    'id' in payload &&
    'email' in payload &&
    typeof (payload as any).id === 'number' &&
    typeof (payload as any).email === 'string'
  );
};

export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;

  // 1. Check for Header
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ message: 'No token provided' });
    return;
  }

  // 2. Extract Token and Secret
  const token = authHeader.split(' ')[1];
  const secret = config.jwtSecret; // Capture into a local variable

  // 3. Validate Secret Existence (This narrows 'secret' from string | undefined to just string)
  if (typeof secret !== 'string') {
    res.status(500).json({ message: 'Server configuration error' });
    return;
  }

  try {
    // 4. Verify (TypeScript now accepts 'secret' because it's a local non-undefined string)
    const decoded = jwt.verify(token, secret);
    
    if (isUserPayload(decoded)) {
      req.user = { id: decoded.id, email: decoded.email };
      next();
    } else {
      res.status(401).json({ message: 'Invalid token structure' });
    }
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};