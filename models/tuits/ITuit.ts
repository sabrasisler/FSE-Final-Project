import IUser from '../users/IUser';

export default interface ITuit {
  tuit: string;
  author: IUser;
  postedDate: Date;
}
