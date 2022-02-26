import { Request, Response, NextFunction } from 'express';
import { Methods } from './Methods';

/**
 * Represents the structure of a controller endpoint object, containing the path, CRUD method {@link Methods}, handler method, and local middleware. Used by a controller to specify each of its endpoint and associated functionality.
 */
export default interface IRoute {
  path: string;
  method: Methods;
  handler: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => void | Promise<void>;
  localMiddleware: ((
    req: Request,
    res: Response,
    next: NextFunction
  ) => void)[];
}
