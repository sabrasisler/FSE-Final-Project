import { Request, Response, NextFunction } from 'express';
import HttpRequest from './HttpRequest';
import HttpResponse from './HttpResponse';

/**
 * Represents generic CRUD functionality of a controller.
 */
export default interface IGenericController {
  findAll(): Promise<HttpResponse>;
  findById(req: HttpRequest): Promise<HttpResponse>;
  create(req: HttpRequest): Promise<HttpResponse>;
  update(req: HttpRequest): Promise<HttpResponse>;
  delete(req: HttpRequest): Promise<HttpResponse>;
}
