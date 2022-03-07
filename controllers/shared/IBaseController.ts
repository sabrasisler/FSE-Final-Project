import { HttpStatusCode } from './HttpStatusCode';
import { Router, Request, Response, NextFunction } from 'express';
import IControllerRoute from './IControllerRoute';

export default interface IBaseController {
  path: string;
  routes: IControllerRoute[];
}
