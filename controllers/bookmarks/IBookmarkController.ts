import { Request, Response, NextFunction } from 'express';
import HttpRequest from '../shared/HttpRequest';
import HttpResponse from '../shared/HttpResponse';
import IBaseController from '../shared/IBaseController';
/**
 * Controller interface for the bookmarks resource.
 */
export default interface IBookMarkController extends IBaseController {
  create(req: HttpRequest): Promise<HttpResponse>;
  findAllByUser(req: HttpRequest): Promise<HttpResponse>;
  delete(req: HttpRequest): Promise<HttpResponse>;
  deleleAllByUser(req: HttpRequest): Promise<HttpResponse>;
}
