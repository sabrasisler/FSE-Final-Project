import IUser from '../users/IUser';
import ITuit from './ITuit';

/**
 * Represents a tuit. Implements the {@link ITuit} model interface. A tuit has an author, posted date, like, and reply count.
 */
export default class Tuit implements ITuit {
  public readonly tuit: string;
  public readonly author?: IUser;
  postedDate: Date;
  likeCount: number = 0;
  replyCount: number = 0;

  /**
   * Constructs the tuit entity with tuit content, posted date, and optional author
   * @param {string} tuit the contents of the tuit
   * @param {string} postedDate
   * @param {IUser} author
   */
  public constructor(tuit: string, postedDate: string, author?: IUser) {
    if (author) {
      this.author = author;
    }
    this.tuit = tuit;
    this.postedDate = new Date(postedDate);
    Object.freeze(this);
  }
}
