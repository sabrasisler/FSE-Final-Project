import InvalidEntityException from '../../errors/InvalidEntityException';
import IUser from '../users/IUser';
import ITuit from './ITuit';

/**
 * Represents a tuit. Implements the {@link ITuit} model interface. A tuit has an author, posted date, like, and reply count.
 */
export default class Tuit implements ITuit {
  public readonly tuit: string;
  public readonly author: IUser;
  likeCount: number = 0;
  replyCount: number = 0;

  /**
   * Constructs the tuit entity with tuit content, posted date, and optional author
   * @param {string} tuit the contents of the tuit
   * @param {string} postedDate
   * @param {IUser} author
   */
  public constructor(tuit: string, author: IUser) {
    this.validateTuit(tuit);
    this.author = author;
    this.tuit = tuit;
    Object.freeze(this);
  }

  validateTuit = (tuit: string) => {
    if (!tuit || tuit.length < 2 || tuit.length > 160) {
      throw new InvalidEntityException(
        'Tuits must be greater than 2 characters and less than 260.'
      );
    }
  };
}
