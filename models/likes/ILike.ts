import ITuit from '../tuits/ITuit';
import IUser from '../users/IUser';

export default interface ILike {
  user: IUser;
  tuit: ITuit;
}
