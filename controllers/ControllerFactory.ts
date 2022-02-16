import IController from './IController';
import ITuitController from './tuits/ITuitController';
import TuitController from './tuits/TuitController';
import { UserController } from './users/UserController';
import { Express } from 'express';
import UserDao from '../daos/users/UserDao';
import UserModel from '../mongoose/users/UserModel';
import TuitDao from '../daos/tuits/TuitDao';
import TuitModel from '../mongoose/tuiters/TuitModel';
import ILikeController from './likes/ILikeController';
import LikeController from './likes/LikeController';
import { LikeDao } from '../daos/likes/LikeDao';
import LikeModel from '../mongoose/likes/LikeModel';

export default class ControllerFactory {
  private static userController: IController | undefined;
  private static tuitController: ITuitController | undefined;
  private static likeController: ILikeController | undefined;

  private constructor() {}

  public static getInstance = (type: string, app: Express): any => {
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
      case 'likes': {
        if (!ControllerFactory.likeController) {
          ControllerFactory.likeController = new LikeController(
            new LikeDao(LikeModel)
          );
          ControllerFactory.registerLikeRoutes(
            app,
            ControllerFactory.likeController
          );
        }
        return ControllerFactory.likeController;
      }
      default:
        return null;
    }
  };
  private static registerUserRoutes = (
    app: Express,
    userController: IController
  ): void => {
    // User
    app.get('/api/users/:uid', userController.findById);
    app.get('/api/users/', userController.findAll);
    app.post('/api/users/create', userController.create);
    app.put('/api/users/:uid', userController.update);
    app.delete('/api/users/:uid', userController.delete);
  };

  private static registerTuitRoutes = (
    app: Express,
    tuitController: ITuitController
  ) => {
    app.get('/api/tuits', tuitController.findAll);
    app.get('/api/users/:uid/tuits', tuitController.findByUser);
    app.get('/api/tuits/:tid', tuitController.findById);
    app.post('/api/users/:uid/tuits', tuitController.create);
    app.put('/api/tuits/:tid', tuitController.update);
    app.delete('/api/tuits/:tid', tuitController.delete);
  };

  private static registerLikeRoutes(
    app: Express,
    likeController: ILikeController
  ) {
    // user likes a tuit
    app.post('/api/users/:uid/likes/:tid', likeController.userLikesTuit);
    // user unlikes a tuit
    app.delete('/api/users/:uid/likes/:tid', likeController.userUnlikesTuit);
    // all tuits liked by user
    app.get('/api/users/:uid/likes', likeController.findAllTuitsLikedByUser);
    // all users that likes a tuit
    app.get('/api/tuits/:tid/likes', likeController.findAllUsersByTuitLike);
  }
}
