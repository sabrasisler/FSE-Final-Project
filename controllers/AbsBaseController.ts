import IBaseController from './IBaseController';
import { Response, Router } from 'express';
import IRoute from './IRoute';
import { HttpStatusCode } from './HttpStatusCode';

/**
 * Represents a base controller with the common functionality of all controllers, including setting the routes and sending a request. Implements {@link IBaseController}. Uses express {@link Router} to break each controller into its own mini app to separate the routing concerns of each controller.
 */
export default abstract class AbsBaseController implements IBaseController {
  protected readonly router: Router = Router();
  public abstract readonly path: string;
  protected abstract readonly routes: Array<IRoute>;

  /**
   * Sends a response back to the client with a status code and payload object.
   * @param {Response} res the express response sent to the client
   * @param {HttpStatusCode} code the status code specified in the enum {@link HttpStatusCode}
   * @param {any} payload the object to send to the client
   */
  sendResponse(res: Response, code: HttpStatusCode, payload?: {}): void {
    if (payload) {
      res.status(code).json(payload);
    } else {
      res.sendStatus(code);
    }
  }

  /**
   * Sets/wires all the paths, local middleware, and handler methods to the controller's router. This functionality decouples defining which routes a controller's has in state from when those routes are to be set/wired to the application router by the server. This method iterates over all the {@link IRoute} objects in the controller's state. For each route object, the router is called is called to use the path, middle, and handler method of the route object.
   * @returns an express {@link Router} configured with all endpoints and local middleware
   */
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
