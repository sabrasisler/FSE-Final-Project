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
import NotificationController from '../controllers/notifications/NotificationController';
import {
  userDao,
  tuitDao,
  bookmarkDao,
  likeDao,
  followDao,
  messageDao,
  notificationDao,
} from './configDaos';
import PassportLocalStrategy from '../controllers/auth/PassportLocalStrategy';
import BcryptHasher from '../controllers/auth/BcryptHasher';
import { handleCentralError } from '../errors/handleCentralError';
import { app } from './configExpress';
import { socketServer } from './configSocketIo';

let alreadyCreated = false;

const hasher = new BcryptHasher(10);

const passportAuthStrategies: Array<IPassPortStrategy> = [
  new PassportGoogleStrategy(),
  new PassportLocalStrategy(hasher),
];

const createControllers = (): void => {
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
    followDao,
    userDao,
    notificationDao
  );
  const likeController: ILikeController = new LikeController(
    '/api/v1/',
    app,
    likeDao,
    tuitDao,
    notificationDao
  );
  const messageController: IMessageController = new MessageController(
    '/api/v1/users',
    app,
    messageDao,
    socketServer
  );

  const notificationController: NotificationController =
    new NotificationController(
      '/api/v1',
      app, 
      notificationDao,
      socketServer);
      
  app.use(handleCentralError);
  alreadyCreated = true;
};

export default createControllers;
