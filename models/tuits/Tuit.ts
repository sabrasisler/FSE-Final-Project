import IUser from '../users/IUser';
import ITuit from './ITuit';

export default class Tuit implements ITuit {
  public readonly tuit: string;
  public readonly author: IUser;
  public readonly postedDate: Date;
  postedOn?: Date | undefined;
  likeCount: number = 0;
  replyCount: number = 0;

  public constructor(tuit: string, postedBy: IUser, postedDate: string) {
    this.tuit = tuit;
    this.author = postedBy;
    this.postedDate = new Date(postedDate);
    Object.freeze(this);
  }
}
