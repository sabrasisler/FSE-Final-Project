import HttpRequest from '../controllers/shared/HttpRequest';
import { HttpStatusCode } from '../controllers/shared/HttpStatusCode';
import { Request, Response, NextFunction } from 'express';

export const adaptRequest =
  (controllerMethod: Function) =>
  async (req: Request, res: Response, next: NextFunction) => {
    console.log(req.body);
    const request: HttpRequest = {
      params: req.params,
      body: req.body,
    };
    try {
      const response = await controllerMethod(request);
      res.status(HttpStatusCode.ok).json(response);
    } catch (err) {
      next(err); // Send error to express central middleware
    }
  };
