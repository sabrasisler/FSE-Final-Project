import dotenv from 'dotenv';
import { Express, RequestHandler } from 'express';
import { Mongoose } from 'mongoose';
import http from 'http';
import IBaseController from '../controllers/IBaseController';
import { exit } from 'process';
dotenv.config();
/**
 * Represents the main server of the app responsible for initializing the database, loading middleware, setting up the controller endpoints, and running the server.
 *
 */
export default class Server {
  private readonly app: Express;
  private readonly port: number;
  private readonly db: Mongoose;
  private readonly controllers: Array<IBaseController>;
  /**
   * Constructs the server with an Express app, port number, Mongoose database, and {@linkIController controllers.
   * @param {Express} app the app
   * @param {number} port the port
   * @param {Mongoose} db the database
   * @param {Array<IBaseController>}controllers the constrollers
   */
  public constructor(
    app: Express,
    port: number,
    db: Mongoose,
    controllers: Array<IBaseController>
  ) {
    this.app = app;
    this.port = port;
    this.db = db;
    this.controllers = controllers;
    Object.freeze(this); // Make this object immutable.
  }

  /**
   * Initializes the database async.
   * @returns void Promise
   */
  initDatabase = async (): Promise<void> => {
    await this.db
      .connect(process.env.MONGO_URL!)
      .then(() => {
        console.log('db connection successful.');
      })
      .catch((err) => {
        console.log('Error connecting to database.');
        exit(1);
      });
    // ...
  };
  /**
   * Loads global express middleware to be used before all route endpoints. Meant to be called be loadControllers(), so the app can be set to use the global middleware before the controller endpoints.
   * @param middleware the global middleware to be used by the app
   */
  public loadGlobalMiddleware = (
    middleware: Array<RequestHandler | any>
  ): void => {
    // global stuff like cors, body-parser, etc
    middleware.forEach((mw) => {
      this.app.use(mw);
    });
  };

  /**
   * Loads all controllers by calling the setRoutes methods of each controller, which sets the app to use the endpoints of each controller with their associated paths, local/specific middleware, and handlers. This method should be run after loadGlobalMiddleware.
   * @returns void
   */
  public loadControllers = (): void => {
    this.controllers.forEach((controller) => {
      // use setRoutes method that maps routes and returns Router object
      this.app.use(controller.path, controller.setRoutes());
    });
  };

  /**
   * Runs the server by listening on the port specified in the local env or in the state.
   * @returns an {@link http} server.
   */
  public run = (): http.Server => {
    return this.app.listen(process.env.PORT! || this.port, () => {
      console.log(`Up and running on port ${process.env.PORT! || this.port}`);
    });
  };
}
