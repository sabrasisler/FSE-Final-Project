import dotenv from 'dotenv';
import { Express, RequestHandler } from 'express';
import { Mongoose } from 'mongoose';
import http from 'http';
import { exit } from 'process';
import ExpressAdapter from './ExpressAdapter';
dotenv.config();
/**
 * Represents the main server of the app responsible for initializing the database, loading controllers, and running the server.
 *
 */
export default class Server {
  private readonly app: Express;
  private readonly port: number;
  private readonly db: Mongoose;
  private readonly expressAdapter: ExpressAdapter;
  /**
   * Constructs the server with an Express app, port number, Mongoose database, and {@linkIController controllers.
   * @param {Express} app the app
   * @param {number} port the port
   * @param {Mongoose} db the database
   * @param {ExpressAdapter} the express adapter object that manages all controllers
   */
  public constructor(
    app: Express,
    port: number,
    db: Mongoose,
    expressAdapter: ExpressAdapter
  ) {
    this.app = app;
    this.port = port;
    this.db = db;
    this.expressAdapter = expressAdapter;
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
   * Call the express adapter to load global middleware and config all controllers to their respective routes.
   * @returns void
   */
  public initControllers = (): void => {
    this.expressAdapter.loadGlobalMiddleware();
    this.expressAdapter.configAllControllers();
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
