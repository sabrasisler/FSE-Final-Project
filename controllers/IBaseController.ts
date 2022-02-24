import { HttpStatusCode } from './HttpStatusCode';
import { Router } from 'express';
import IRoute from './IRoute';

import { Request, Response } from 'express';
export default interface IBaseController {
  path: string;
  setRoutes(): Router;
  sendResponse(res: Response, code: HttpStatusCode, payload?: {}): void;
}
