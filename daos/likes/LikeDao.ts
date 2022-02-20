import IDao from '../IDao';
import { Model } from 'mongoose';
import ILikeDao from './ILikeDao';
import ILike from '../../models/likes/ILike';
import IUser from '../../models/users/IUser';
import ITuit from '../../models/tuits/ITuit';
import TuitModel from '../../mongoose/tuiters/TuitModel';

export class LikeDao implements ILikeDao {
  private readonly likeModel: Model<ILike>;
  private readonly userModel: Model<IUser>;

  public constructor(likeModel: Model<ILike>, userModel: Model<IUser>) {
    this.likeModel = likeModel;
    this.userModel = userModel;
  }
  userLikesTuit = async (uid: string, tid: string): Promise<ITuit> => {
    //TODO: Only create if like doesn't exist yet using upsert.
    const like: ILike | null = await this.likeModel
      .findOneAndUpdate(
        { user: uid, tuit: tid },
        { user: uid, tuit: tid },
        { upsert: true }
      )
      .populate('tuit');
    if (like != null) {
      return like.tuit;
    }
    throw new Error();
  };
  userUnlikesTuit = async (uid: string, tid: string): Promise<ITuit> => {
    const deletedLike = await this.likeModel
      .findOneAndDelete({
        user: uid,
        tuit: tid,
      })
      .populate('tuit');
    // Update tuit count.
    if (deletedLike != null) {
      await TuitModel.updateOne(
        { _id: deletedLike.tuit },
        { $inc: { likeCount: -1 } },
        { new: true }
      );
      return deletedLike.tuit;
    }
    throw new Error();
  };
  findAllUsersByTuitLike = async (tid: string): Promise<IUser[]> => {
    const likes: ILike[] = await this.likeModel
      .find({ tuit: tid })
      .populate('user')
      .exec();
    const users: IUser[] = [];
    likes.map((like) => {
      users.push(like.user);
    });
    return users;
  };
  findAllTuitsLikedByUser = async (uid: string): Promise<ITuit[]> => {
    const likes: ILike[] = await this.likeModel
      .find({ user: uid })
      .populate({ path: 'tuit' })
      .exec();
    const tuits: ITuit[] = [];
    likes.map((like) => {
      tuits.push(like.tuit);
    });
    return tuits;
  };
}
