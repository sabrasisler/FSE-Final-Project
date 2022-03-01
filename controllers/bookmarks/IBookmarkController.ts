import { Request, Response, NextFunction } from 'express';
import HttpRequest from '../HttpRequest';
import HttpResponse from '../HttpResponse';
import IBaseController from '../IBaseController';
/**
 * Controller interface for the bookmarks resource.
 */
export default interface IBookMarkController extends IBaseController {
  create(req: HttpRequest): Promise<HttpResponse>;
  findAllByUser(req: HttpRequest): Promise<HttpResponse>;
  delete(req: HttpRequest): Promise<HttpResponse>;
  deleleAllByUser(req: HttpRequest): Promise<HttpResponse>;
}
