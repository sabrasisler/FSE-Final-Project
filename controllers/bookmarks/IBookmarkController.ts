import { Request, Response, NextFunction } from 'express';
import HttpRequest from '../shared/HttpRequest';
import HttpResponse from '../shared/HttpResponse';
/**
 * Controller interface for the bookmarks resource.
 */
export default interface IBookMarkController {
  create(req: HttpRequest): Promise<HttpResponse>;
  findAllByUser(req: HttpRequest): Promise<HttpResponse>;
  delete(req: HttpRequest): Promise<HttpResponse>;
  deleteAllByUser(req: HttpRequest): Promise<HttpResponse>;
}
