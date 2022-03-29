import ILike from '../../models/likes/ILike';
import ITuit from '../../models/tuits/ITuit';
import IUser from '../../models/users/IUser';
/**
 * Common operations for a DAO handling the likes resource.
 */
export default interface ILikeDao {
  // dislikeExists(userId: string, tuitId: string): Promise<any>;
  findLike(userId: string, tuitId: string): Promise<ILike | null>;
  findDislike(userId: string, tuitId: string): Promise<ILike | null>;
  createLike(uid: string, tuitId: string): Promise<ITuit>;
  createDislike(uid: string, tuitId: string): Promise<ITuit>;
  deleteLike(uid: string, tuitId: string): Promise<ITuit>;
  deleteDislike(uid: string, tuitId: string): Promise<ITuit>;
  findAllUsersByTuitLike(tuitId: string): Promise<IUser[]>;
  findAllTuitsLikedByUser(uid: string): Promise<ITuit[]>;
  findAllTuitsDislikedByUser(uid: string): Promise<ITuit[]>;
}
