import { Request, Response, NextFunction } from 'express';
import IUser from '../models/users/IUser';
import HttpRequest from './HttpRequest';
import HttpResponse from './HttpResponse';
import IBaseController from './IBaseController';

/**
 * Represents generic CRUD functionality of a controller.
 */
export default interface IGenericController extends IBaseController {
  findAll(req: HttpRequest): Promise<HttpResponse>;
  findById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<HttpResponse>;
  create(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<HttpResponse>;
  update(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<HttpResponse>;
  delete(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<HttpResponse>;
}
