import { Express } from 'express';
import IPassPortStrategy from '../controllers/auth/IPassPortStrategy';
import PassportAuthController from '../controllers/auth/PassportAuthController';
import PassportGoogleStrategy from '../controllers/auth/PassportGoogleStrategy';
import BookMarkController from '../controllers/bookmarks/BookmarkController';
import IBookMarkController from '../controllers/bookmarks/IBookmarkController';
import FollowController from '../controllers/follows/FollowController';
import IFollowController from '../controllers/follows/IFollowController';
import ILikeController from '../controllers/likes/ILikeController';
import LikeController from '../controllers/likes/LikeController';
import IMessageController from '../controllers/messages/IMessageController';
import MessageController from '../controllers/messages/MessageController';
import IGenericController from '../controllers/shared/IGenericController';
import ITuitController from '../controllers/tuits/ITuitController';
import TuitController from '../controllers/tuits/TuitController';
import { UserController } from '../controllers/users/UserController';
import IUser from '../models/users/IUser';
import IValidator from '../shared/IValidator';
import UserValidator from '../models/users/UserValidator';
import {
  userDao,
  tuitDao,
  bookmarkDao,
  likeDao,
  followDao,
  messageDao,
} from './createDaos';
import PassportLocalStrategy from '../controllers/auth/PassportLocalStrategy';
import BcryptHasher from '../controllers/auth/BcryptHasher';
import { Server } from 'socket.io';
import ChatSocketService from '../services/ChatSocketService';

let alreadyCreated = false;

const hasher = new BcryptHasher(10);

const passportAuthStrategies: Array<IPassPortStrategy> = [
  new PassportGoogleStrategy(),
  new PassportLocalStrategy(hasher),
];

const createControllers = (app: Express, io: Server): void => {
  if (alreadyCreated) {
    return;
  }
  const userController: IGenericController = new UserController(
    '/api/v1/users',
    app,
    userDao
  );
  const passportAuthController: PassportAuthController =
    new PassportAuthController(app, userDao, passportAuthStrategies, hasher);
  const tuitController: ITuitController = new TuitController(
    '/api/v1',
    app,
    tuitDao
  );
  const bookmarkController: IBookMarkController = new BookMarkController(
    '/api/v1/users',
    app,
    bookmarkDao
  );
  const followController: IFollowController = new FollowController(
    '/api/v1/users/',
    app,
    followDao
  );
  const likeController: ILikeController = new LikeController(
    '/api/v1/',
    app,
    likeDao,
    tuitDao
  );
  const chatService = new ChatSocketService(io);
  const messageController: IMessageController = new MessageController(
    '/api/v1/users',
    app,
    messageDao,
    chatService
  );
  alreadyCreated = true;
};

export default createControllers;
