import IController from './IController';
import ITuitController from './ITuitController';
import TuitController from './TuitController';
import { UserController } from './UserController';
import { Express, Request, NextFunction, Response } from 'express';
import IDao from '../daos/IDao';
import ErrorHandler from '../shared/ErrorHandler';
import UserDao from '../daos/UserDao';
import UserModel from '../mongoose/users/UserModel';
import TuitDao from '../daos/TuitDao';
import TuitModel from '../mongoose/tuiters/TuitModel';

export default class ControllerFactory {
  private static userController: IController | undefined;
  private static tuitController: ITuitController | undefined;

  private constructor() {}

  public static getInstance(type: string, app: Express): IController | null {
    switch (type) {
      case 'user': {
        if (!ControllerFactory.userController) {
          ControllerFactory.userController = new UserController(
            new UserDao(UserModel)
          );
          ControllerFactory.registerUserRoutes(
            app,
            ControllerFactory.userController
          );
        }
        return ControllerFactory.userController;
      }
      case 'tuit': {
        if (!ControllerFactory.tuitController) {
          ControllerFactory.tuitController = new TuitController(
            new TuitDao(TuitModel)
          );
          ControllerFactory.registerTuitRoutes(
            app,
            ControllerFactory.tuitController
          );
        }
        return ControllerFactory.tuitController;
      }
      default:
        return null;
    }
  }
  private static registerUserRoutes(
    app: Express,
    controller: IController
  ): void {
    // User
    app.get('/api/users/:uid', controller.findById);
    app.get('/api/users/', controller.findAll);
    app.post('/api/users/create', controller.create);
    app.put('/api/users/:uid', controller.update);
    app.delete('/api/users/:uid', controller.delete);
  }

  private static registerTuitRoutes(app: Express, controller: ITuitController) {
    app.get('/api/tuits', controller.findAll);
    app.get('/api/users/:uid/tuits', controller.findByUser);
    app.get('/api/tuits/:tid', controller.findById);
    app.post('/api/users/:uid/tuits', controller.create);
    app.put('/api/tuits/:tid', controller.update);
    app.delete('/api/tuits/:tid', controller.delete);
  }
}
