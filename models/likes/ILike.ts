import ITuit from '../tuits/ITuit';
import IUser from '../users/IUser';

/**
 * Model interface for a like.
 */
export default interface ILike {
  user: IUser;
  tuit: ITuit;
}
