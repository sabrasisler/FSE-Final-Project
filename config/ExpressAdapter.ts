import {
  Response,
  Router,
  Request,
  NextFunction,
  Express,
  RequestHandler,
} from 'express';
import { HttpStatusCode } from '../controllers/shared/HttpStatusCode';
import HttpRequest from '../controllers/shared/HttpRequest';
import BaseError from '../errors/BaseError';
import { exit } from 'process';
import IBaseController from '../controllers/shared/IBaseController';
import HttpResponse from '../controllers/shared/HttpResponse';

/**
 * Adapter that encapsulates all express operations and decouples it from the all the controllers. Responsible for loading all global middleware, wiring all controllers to their respective request routes, sending requests to the client, and managing central errors.
 */
export default class ExpressAdapter {
  private readonly globalMiddleware: Array<RequestHandler | any>;
  private readonly controllers: IBaseController[];
  private readonly app: Express;
  /**
   * Builds the adapter by setting the app, middleware, and controller to state.
   * @param app the main app
   * @param globalMiddleware any global middleware to be run before any endpoints
   * @param controllers all controllers of the app
   */
  constructor(
    app: Express,
    globalMiddleware: Array<RequestHandler | any>,
    controllers: IBaseController[]
  ) {
    this.globalMiddleware = globalMiddleware;
    this.controllers = controllers;
    this.app = app;
  }
  /**
   * Adapts express requests and responses to internal controller requests and responses.
   * Takes a method function from a controller, and returns a function to express that does the following:
   * 1. Extracts the express request properties into an internal {@link HttpRequest} http request object
   * 2. Passes the internal http request object to the controller, and waits for a response
   * 3. Takes a response from the controller as an internal http response object, and sends the contents back to the client.
   * @param controllerMethod the controller method function
   * @returns an express endpoint handler used by express to process the request
   */
  adaptRequest =
    (controllerMethod: Function) =>
    async (req: Request, res: Response, next: NextFunction) => {
      const request: HttpRequest = {
        params: req.params,
        body: req.body,
      };
      try {
        const response: HttpResponse = await controllerMethod(request);
        res.status(HttpStatusCode.ok).json(response);
      } catch (err) {
        this.handleCentralError(err, req, res, next); // Send error to express central middleware
      }
    };

  public loadGlobalMiddleware = (): void => {
    // global stuff like cors, body-parser, etc
    this.globalMiddleware.forEach((mw) => {
      this.app.use(mw);
    });
  };

  /**
   * Sets/wires all the paths, local middleware, and handler methods to the controller's router. This functionality decouples defining which routes a controller's has in state from when those routes are to be set/wired to the application. This method iterates over all the route objects in the controller's state. For each route object, the router is called is called to use the path, middleware, and handler method of the route object.
   * @returns void
   */
  configAllControllers = (): void => {
    for (const controller of this.controllers) {
      const router = Router();
      for (const route of controller.routes) {
        switch (route.method) {
          case 'GET':
            router.get(route.path, this.adaptRequest(route.handler));
            break;
          case 'POST':
            router.post(route.path, this.adaptRequest(route.handler));
            break;
          case 'PUT':
            router.put(route.path, this.adaptRequest(route.handler));
            break;
          case 'DELETE':
            router.delete(route.path, this.adaptRequest(route.handler));
            break;
          default:
        }
      }
      this.app.use(controller.path, router);
    }
  };
  /**
   * Central error handler for the controller that handles known and unknown errors and sends user-friendly messages to the client.
   * @param {unknown} err the error throw by the controller
   * @param {Request} req the original express request
   * @param {Response} res the express response
   * @param {NextFunction} next the next middleware function
   * @returns void
   */
  handleCentralError = (
    err: unknown,
    req: Request,
    res: Response,
    next: NextFunction
  ): void => {
    console.log(err); // TODO: Add logger here.
    const clientResponse: HttpResponse = {
      code: HttpStatusCode.internalError,
      body: {
        error: 'Sorry, something went wrong!',
        path: req.path,
      },
    };
    const errorDetails = {
      error: '',
      path: req.path,
    };
    if (err instanceof BaseError && err.code !== HttpStatusCode.internalError) {
      clientResponse.code = err.code;
      errorDetails.error = err.message;
      clientResponse.body = errorDetails;
    }
    res.status(HttpStatusCode.internalError).json(clientResponse);
    if (!(err instanceof BaseError && err.isOperational)) {
      exit(1); // exit in the case of uncaught unexpected errors
    }
  };
}
