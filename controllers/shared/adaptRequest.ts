import { Request, Response, NextFunction } from 'express';
import HttpRequest from './HttpRequest';
import HttpResponse from './HttpResponse';
import { StatusCode } from './HttpStatusCode';
const adaptRequest =
  (controllerMethod: Function) =>
  async (req: Request, res: Response, next: NextFunction) => {
    const request: HttpRequest = {
      params: req.params,
      body: req.body,
      user: req.user,
      all: { ...req },
    };
    try {
      const response: HttpResponse = await controllerMethod(request);
      res.status(StatusCode.ok).json(response.body);
    } catch (err) {
      next(err);
    }
  };

export { adaptRequest };
