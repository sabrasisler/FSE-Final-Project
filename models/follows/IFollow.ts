import IUser from '../users/IUser';

export default interface IFollow {
  follower: IUser;
  followee: IUser;
  accepted: boolean;
}
