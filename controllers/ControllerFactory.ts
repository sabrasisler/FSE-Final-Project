import IController from './IController';
import ITuitController from './ITuitController';
import TuitController from './TuitController';
import { UserController } from './UserController';
import { Express } from 'express';
import IDao from '../daos/IDao';

export default class ControllerFactory {
  private static userController: IController | undefined;
  private static tuitController: ITuitController | undefined;

  private constructor() {}

  public static getInstance(
    type: string,
    app: Express,
    dao: IDao
  ): IController | null {
    switch (type) {
      case 'user': {
        !ControllerFactory.userController
          ? (ControllerFactory.userController = new UserController(app, dao))
          : (ControllerFactory.userController =
              ControllerFactory.userController);
        ControllerFactory.registerUserControllerRoutes(
          app,
          ControllerFactory.userController
        );
        return ControllerFactory.userController;
      }
      case 'tuit': {
        // !this.tuitController
        //   ? (this.tuitController = new TuitController())
        //   : this.tuitController;
        // return this.tuitController;
      }
      default:
        console.log('default reached');
        return null;
    }
  }
  private static registerUserControllerRoutes(
    app: Express,
    controller: IController
  ): void {
    app.get('/api/users/:uid', controller.findById);
    app.get('/api/users/', controller.findAll);

    app.post('/api/users/create', controller.create);
    app.put('/api/users/:uid', controller.update);
    app.delete('/api/users/:uid', controller.delete);
  }
}
