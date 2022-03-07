import IUser from '../users/IUser';

/**
 * Model interface for a tuit.
 */
export default interface ITuit {
  tuit: string;
  author: IUser;
  postedDate?: Date;
  likeCount?: number;
  replyCount?: number;
}
