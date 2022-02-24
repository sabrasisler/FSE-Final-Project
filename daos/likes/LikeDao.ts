import IDao from '../IDao';
import { Model } from 'mongoose';
import ILikeDao from './ILikeDao';
import ILike from '../../models/likes/ILike';
import IUser from '../../models/users/IUser';
import ITuit from '../../models/tuits/ITuit';
import TuitModel from '../../mongoose/tuiters/TuitModel';
import IErrorHandler from '../../errors/IErrorHandler';
import { LikeDaoErrors } from '../../errors/LikeDaoErrors';

export class LikeDao implements ILikeDao {
  private readonly likeModel: Model<ILike>;
  private readonly errorHandler: IErrorHandler;

  public constructor(likeModel: Model<ILike>, errorHandler: IErrorHandler) {
    this.likeModel = likeModel;
    this.errorHandler = errorHandler;
  }
  userLikesTuit = async (uid: string, tid: string): Promise<ILike> => {
    //TODO: Only create if like doesn't exist yet using upsert.
    try {
      const like: ILike | null = await this.likeModel
        .findOneAndUpdate(
          { user: uid, tuit: tid },
          { user: uid, tuit: tid },
          { upsert: true }
        )
        .populate('tuit');
      return this.errorHandler.sameObjectOrNullException(
        like,
        LikeDaoErrors.LIKE_NOT_FOUND
      );
    } catch (err) {
      throw this.errorHandler.createError(LikeDaoErrors.DB_ERROR_LIKE_TUIT);
    }
  };
  userUnlikesTuit = async (uid: string, tid: string): Promise<ILike> => {
    try {
      const deletedLike = await this.likeModel
        .remove({
          user: uid,
          tuit: tid,
        })
        .populate('tuit');
      if (deletedLike != null) {
        await TuitModel.updateOne(
          { _id: deletedLike.tuit },
          { $inc: { likeCount: -1 } },
          { new: true }
        );
      }
      return this.errorHandler.sameObjectOrNullException(
        deletedLike,
        LikeDaoErrors.DELETED_LIKE_NOT_FOUND
      );
    } catch (err) {
      throw this.errorHandler.createError(LikeDaoErrors.DB_ERROR_UNLIKE_TUIT);
    }
  };
  findAllUsersByTuitLike = async (tid: string): Promise<IUser[]> => {
    try {
      const likes: ILike[] = await this.likeModel
        .find({ tuit: tid })
        .populate('user')
        .exec();
      const users: IUser[] = [];
      likes.map((like) => {
        users.push(like.user);
      });
      return this.errorHandler.sameObjectOrNullException(
        users,
        LikeDaoErrors.NO_USERS_FOUND_FOR_LIKE
      );
    } catch (err) {
      throw this.errorHandler.createError(
        LikeDaoErrors.DB_ERROR_USERS_BY_LIKE,
        err
      );
    }
  };
  findAllTuitsLikedByUser = async (uid: string): Promise<ITuit[]> => {
    try {
      const likes: ILike[] = await this.likeModel
        .find({ user: uid })
        .populate({ path: 'tuit' })
        .exec();
      const tuits: ITuit[] = [];
      likes.map((like) => {
        tuits.push(like.tuit);
      });
      return this.errorHandler.sameObjectOrNullException(
        tuits,
        LikeDaoErrors.NO_TUITS_FOUND_FOR_LIKE
      );
    } catch (err) {
      throw this.errorHandler.createError(LikeDaoErrors.DB_ERROR_TUITS_BY_LIKE);
    }
  };
}
