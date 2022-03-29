import IUser from '../users/IUser';

/**
 * Model interface for a tuit.
 */
export default interface ITuit {
  tuit: string;
  author: IUser;
  stats?: {
    likes: number;
    dislikes: number;
    replies: number;
    retuits: number;
  };
  postedDate?: Date;
  likedBy?: [];
  dislikedBy?: [];
}
