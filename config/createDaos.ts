import BookmarkDao from '../daos/bookmarks/BookmarkDao';
import IBookMarkDao from '../daos/bookmarks/IBookmarkDao';
import FollowDao from '../daos/follows/FollowDao';
import IFollowDao from '../daos/follows/IFollowDao';
import ILikeDao from '../daos/likes/ILikeDao';
import { LikeDao } from '../daos/likes/LikeDao';
import IMessageDao from '../daos/messages/IMessageDao';
import MessageDao from '../daos/messages/MessageDao';
import IDao from '../daos/shared/IDao';
import ITuitDao from '../daos/tuits/ITuitDao';
import TuitDao from '../daos/tuits/TuitDao';
import UserDao from '../daos/users/UserDao';
import DaoErrorHandler from '../errors/DaoErrorHandler';
import IUser from '../models/users/IUser';
import BookmarkModel from '../mongoose/bookmarks/BookmarkModel';
import FollowModel from '../mongoose/follows/FollowModel';
import LikeModel from '../mongoose/likes/LikeModel';
import ConversationModel from '../mongoose/messages/ConversationModel';
import MessageModel from '../mongoose/messages/MessageModel';
import TuitModel from '../mongoose/tuits/TuitModel';
import UserModel from '../mongoose/users/UserModel';

const daoErrorHandler = new DaoErrorHandler();
export const userDao: IDao<IUser> = new UserDao(UserModel, daoErrorHandler);
export const bookmarkDao: IBookMarkDao = new BookmarkDao(
  BookmarkModel,
  daoErrorHandler
);
export const followDao: IFollowDao = new FollowDao(
  FollowModel,
  daoErrorHandler
);
export const likeDao: ILikeDao = new LikeDao(LikeModel, daoErrorHandler);
export const tuitDao: ITuitDao = new TuitDao(
  TuitModel,
  UserModel,
  daoErrorHandler
);
export const messageDao: IMessageDao = new MessageDao(
  MessageModel,
  ConversationModel,
  daoErrorHandler
);
