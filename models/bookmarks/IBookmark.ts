import ITuit from '../tuits/ITuit';
import IUser from '../users/IUser';

/**
 * Model interface of a bookmark
 */
export default interface IBookmark {
  user: IUser;
  tuit: ITuit;
}
