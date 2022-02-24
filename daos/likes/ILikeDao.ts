import ILike from '../../models/likes/ILike';
import ITuit from '../../models/tuits/ITuit';
import IUser from '../../models/users/IUser';

export default interface ILikeDao {
  userLikesTuit(uid: string, tid: string): Promise<ILike>;
  userUnlikesTuit(uid: string, tid: string): Promise<ILike>;
  findAllUsersByTuitLike(tid: string): Promise<IUser[]>;
  findAllTuitsLikedByUser(uid: string): Promise<ITuit[]>;
}
