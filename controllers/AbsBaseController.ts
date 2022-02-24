import IBaseController from './IBaseController';
import { Response, Router } from 'express';
import IRoute from './IRoute';
import { HttpStatusCode } from './HttpStatusCode';

export default abstract class AbsBaseController implements IBaseController {
  protected readonly router: Router = Router();
  public abstract readonly path: string;
  protected abstract readonly routes: Array<IRoute>;

  sendResponse(res: Response, code: HttpStatusCode, payload?: {}): void {
    if (payload) {
      res.status(code).json(payload);
    } else {
      res.sendStatus(code);
    }
  }
  setRoutes = (): Router => {
    for (const route of this.routes) {
      for (const middleware of route.localMiddleware) {
        this.router.use(route.path, middleware);
      }
      switch (route.method) {
        case 'GET':
          this.router.get(route.path, route.handler);
          break;
        case 'POST':
          this.router.post(route.path, route.handler);
          break;
        case 'PUT':
          this.router.put(route.path, route.handler);
          break;
        case 'DELETE':
          this.router.delete(route.path, route.handler);
          break;
        default:
      }
    }
    return this.router;
  };
}
