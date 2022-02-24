import express, { Request, RequestHandler, Response, Router } from 'express';
import Server from './config/Server';
import CommonErrorHandler from './errors/CommonErrorHandler';
import mongoose from 'mongoose';
import IBaseController from './controllers/IBaseController';
import MessageController from './controllers/messages/MessageController';
import MessageDao from './daos/messages/MessageDao';
import ConversationModel from './mongoose/messages/ConversationModel';
import MessageModel from './mongoose/messages/MessageModel';
import TuitController from './controllers/tuits/TuitController';
import TuitDao from './daos/tuits/TuitDao';
import TuitModel from './mongoose/tuiters/TuitModel';
import IErrorHandler from './errors/IErrorHandler';
import { UserController } from './controllers/users/UserController';
import UserDao from './daos/users/UserDao';
import UserModel from './mongoose/users/UserModel';

const app = express();
const primaryMiddleware: Array<RequestHandler> = [
  express.json(),
  //   cors({ credentials: true, origin: true }),
];
const errorHandler: IErrorHandler = new CommonErrorHandler();
const secondaryMiddleware = [errorHandler.handleCentralError];
const controllers: Array<IBaseController> = [
  new UserController(new UserDao(UserModel, errorHandler)),
  new TuitController(new TuitDao(TuitModel, errorHandler)),
  new MessageController(
    new MessageDao(MessageModel, ConversationModel, errorHandler)
  ),
];

const server: Server = new Server(app, 4000, mongoose, controllers);
Promise.resolve().then(() =>
  server.initDatabase().then(() => {
    server.loadMiddleware(primaryMiddleware);
    server.loadControllers();
    server.loadMiddleware(secondaryMiddleware);
    server.run();
  })
);
