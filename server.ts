import express, { RequestHandler } from 'express';
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
import TuitModel from './mongoose/tuits/TuitModel';
import IErrorHandler from './errors/IErrorHandler';
import { UserController } from './controllers/users/UserController';
import UserDao from './daos/users/UserDao';
import UserModel from './mongoose/users/UserModel';
import { LikeDao } from './daos/likes/LikeDao';
import LikeModel from './mongoose/likes/LikeModel';
import LikeController from './controllers/likes/LikeController';
import BookMarkController from './controllers/bookmarks/BookmarkController';
import BookmarkDao from './daos/bookmarks/BookmarkDao';
import BookmarkModel from './mongoose/bookmarks/BookmarkModel';

const app = express();
const primaryMiddleware: Array<RequestHandler> = [
  express.json(),
  //   cors({ credentials: true, origin: true }),
];
// Middleware and Helpers
const errorHandler: IErrorHandler = new CommonErrorHandler();
const secondaryMiddleware = [errorHandler.handleCentralError];
// Controllers
const controllers: Array<IBaseController> = [
  new UserController(new UserDao(UserModel, errorHandler)),
  new TuitController(new TuitDao(TuitModel, errorHandler)),
  new MessageController(
    new MessageDao(MessageModel, ConversationModel, errorHandler)
  ),
  new LikeController(new LikeDao(LikeModel, errorHandler)),
  new BookMarkController(new BookmarkDao(BookmarkModel, errorHandler)),
];
// Set up server and initialize resources.
const server: Server = new Server(app, 4000, mongoose, controllers);
Promise.resolve().then(() =>
  server.initDatabase().then(() => {
    server.loadGlobalMiddleware(primaryMiddleware);
    server.loadControllers();
    server.loadGlobalMiddleware(secondaryMiddleware);
    server.run();
  })
);
