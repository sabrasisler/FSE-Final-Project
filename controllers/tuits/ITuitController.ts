import IController from '../IController';
import { NextFunction, Request, Response } from 'express';

/**
 * Represents the interface functionality of a tuit controller to handle requests and responses for the tuit resource.
 */
export default interface ITuitController extends IController {
  findByUser(req: Request, res: Response, next: NextFunction): Promise<void>;
}
