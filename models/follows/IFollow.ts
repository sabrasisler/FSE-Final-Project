import IUser from '../users/IUser';

export default interface IFollow {
  follower: IUser;
  following: IUser;
}
