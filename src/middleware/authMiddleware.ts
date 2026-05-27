import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

interface AuthRequest extends Request {
  user?: JwtPayload;
}

export function authMiddleware(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized.' });
    }

    const decoded: JwtPayload = jwt.verify(
      token,
      process.env.JWT_SECRET || 'secret-key',
    ) as JwtPayload;
    req.user = decoded;
    next();
  } catch {
    return res.status(403).json({ message: 'Forbidden.' });
  }
}
