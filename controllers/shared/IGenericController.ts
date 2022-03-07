import { Request, Response, NextFunction } from 'express';
import HttpRequest from './HttpRequest';
import HttpResponse from './HttpResponse';
import IBaseController from './IBaseController';

/**
 * Represents generic CRUD functionality of a controller.
 */
export default interface IGenericController extends IBaseController {
  findAll(): Promise<HttpResponse>;
  findById(req: HttpRequest): Promise<HttpResponse>;
  create(req: HttpRequest): Promise<HttpResponse>;
  update(req: HttpRequest): Promise<HttpResponse>;
  delete(req: HttpRequest): Promise<HttpResponse>;
}
