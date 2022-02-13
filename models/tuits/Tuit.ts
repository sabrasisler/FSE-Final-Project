import IUser from '../users/IUser';
import ITuit from './ITuit';

export default class Tuit implements ITuit {
  public readonly tuit: string;
  public readonly author: IUser;
  postedOn?: Date | undefined;

  public constructor(tuit: string, postedBy: IUser) {
    this.tuit = tuit;
    this.author = postedBy;
    Object.freeze(this);
  }
}
