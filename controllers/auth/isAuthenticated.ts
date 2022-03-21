import { Request, Response, Express, NextFunction } from 'express';
import UnauthorizedException from './UnauthorizedException';
export const isAuthenticated = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    throw new UnauthorizedException('Not authenticated.');
  }
};
