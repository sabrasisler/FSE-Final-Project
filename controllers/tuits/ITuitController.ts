import IGenericController from '../IGenericController';
import { NextFunction, Request, Response } from 'express';
import HttpResponse from '../HttpResponse';
import HttpRequest from '../HttpRequest';

/**
 * Represents the interface functionality of a tuit controller to handle requests and responses for the tuit resource.
 */
export default interface ITuitController extends IGenericController {
  findByUser(req: HttpRequest): Promise<HttpResponse>;
}
