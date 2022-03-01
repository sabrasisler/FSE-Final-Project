import express, { RequestHandler } from 'express';
import Server from './config/Server';
import DaoErrorHandler from './errors/DaoErrorHandler';
import mongoose from 'mongoose';
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
import ExpressAdapter from './config/ExpressAdapter';
import IBaseController from './controllers/IBaseController';
import FollowController from './controllers/follows/FollowController';
import FollowDao from './daos/follows/FollowDao';
import FollowModel from './mongoose/follows/FollowModel';

const app = express();

const globalMiddleware: Array<RequestHandler> = [
  express.json(),
  //   cors({ credentials: true, origin: true }),
];
const daoErrorHandler: IErrorHandler = new DaoErrorHandler();

const allControllers: IBaseController[] = [
  new UserController(new UserDao(UserModel, daoErrorHandler)),
  new TuitController(new TuitDao(TuitModel, daoErrorHandler)),
  new MessageController(
    new MessageDao(MessageModel, ConversationModel, daoErrorHandler)
  ),
  new LikeController(new LikeDao(LikeModel, daoErrorHandler)),
  new BookMarkController(new BookmarkDao(BookmarkModel, daoErrorHandler)),
  new FollowController(new FollowDao(FollowModel, daoErrorHandler)),
];
const expressAdapter: ExpressAdapter = new ExpressAdapter(
  app,
  globalMiddleware,
  allControllers
);
// Set up server and initialize resources.
const server: Server = new Server(app, 4000, mongoose, expressAdapter);
Promise.resolve().then(() =>
  server.initDatabase().then(() => {
    server.initControllers();
    server.run();
  })
);
