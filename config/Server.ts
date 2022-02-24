import dotenv from 'dotenv';
import { Express, RequestHandler } from 'express';
import { Mongoose } from 'mongoose';
import http from 'http';
import IBaseController from '../controllers/IBaseController';
import { exit } from 'process';
dotenv.config();

export default class Server {
  private readonly app: Express;
  private readonly port: number;
  private readonly db: Mongoose;
  private readonly controllers: Array<IBaseController>;

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
  }

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

  public loadMiddleware = (middleware: Array<RequestHandler | any>): void => {
    // global stuff like cors, body-parser, etc
    middleware.forEach((mw) => {
      this.app.use(mw);
    });
  };

  public loadControllers = (): void => {
    this.controllers.forEach((controller) => {
      // use setRoutes method that maps routes and returns Router object
      this.app.use(controller.path, controller.setRoutes());
    });
  };

  public run = (): http.Server => {
    return this.app.listen(process.env.PORT! || this.port, () => {
      console.log(`Up and running on port ${process.env.PORT! || this.port}`);
    });
  };
}
