import IUser from '../users/IUser';

export default interface ITuit {
  tuit: string;
  postedBy: IUser;
}