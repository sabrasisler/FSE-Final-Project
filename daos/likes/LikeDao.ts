import IDao from '../IDao';
import { Model } from 'mongoose';
import ILikeDao from './ILikeDao';
import ILike from '../../models/likes/ILike';
import IUser from '../../models/users/IUser';
import ITuit from '../../models/tuits/ITuit';
import TuitModel from '../../mongoose/tuiters/TuitModel';

export class LikeDao implements ILikeDao {
  private readonly model: Model<ILike>;

  public constructor(model: Model<ILike>) {
    this.model = model;
  }
  userLikesTuit = async (uid: string, tid: string): Promise<ITuit> => {
    const like = await this.model.create({ user: uid, tuit: tid });
    const likeWithTuit = await like.populate('tuit');
    return likeWithTuit.tuit;
  };
  userUnlikesTuit = async (uid: string, tid: string): Promise<ITuit | null> => {
    const deletedLike = await this.model.findOneAndDelete({
      user: uid,
      tuit: tid,
    });
    if (deletedLike != null) {
      const tuitUnliked = await TuitModel.findOneAndUpdate(
        { _id: deletedLike.tuit },
        { $inc: { likeCount: -1 } },
        { new: true }
      );
      return tuitUnliked;
    }
    return null;
  };
  findAllUsersByTuitLike(): Promise<IUser[]> {
    throw new Error('Method not implemented.');
  }
  findAllTuitsLikedByUser(): Promise<ITuit[]> {
    throw new Error('Method not implemented.');
  }
}
