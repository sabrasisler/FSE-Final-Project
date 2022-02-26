import { Request, Response, NextFunction } from 'express';
/**
 * Controller interface for the bookmarks resource.
 */
export default interface IBookMarkController {
  create(req: Request, res: Response, next: NextFunction): Promise<void>;
  findAllByUser(req: Request, res: Response, next: NextFunction): Promise<void>;
  delete(req: Request, res: Response, next: NextFunction): Promise<void>;
}
