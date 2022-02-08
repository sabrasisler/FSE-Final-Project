import IController from './IController';
import { NextFunction, Request, Response } from 'express';
export default interface ITuitController extends IController {
  findByUser(req: Request, res: Response, next: NextFunction): void;
}
