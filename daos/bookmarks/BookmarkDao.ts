import { Model } from 'mongoose';
import { BookmarkDaoErrors } from '../../errors/BookmarkDaoErrors';
import IErrorHandler from '../../errors/IErrorHandler';
import IBookmark from '../../models/bookmarks/IBookmark';
import IBookMarkDao from './IBookmarkDao';

export default class BookmarkDao implements IBookMarkDao {
  private readonly bookmarkModel: Model<IBookmark>;
  private readonly errorHandler: IErrorHandler;
  public constructor(
    bookmarkModel: Model<IBookmark>,
    errorHandler: IErrorHandler
  ) {
    this.bookmarkModel = bookmarkModel;
    this.errorHandler = errorHandler;
  }

  /**
   * Create a new bookmark document with the user and tuit foreign keys, and then populates the bookmark with the tuits and the authors to be sent back to the caller.
   * @param {string} userId the user id
   * @param {string} tuitId the tuit id
   * @returns IBookmark Promise
   */
  create = async (userId: string, tuitId: string): Promise<IBookmark> => {
    try {
      // Create the new book mark, populate the tuit and the author of each tuit.
      return await (
        await this.bookmarkModel.create({ user: userId, tuit: tuitId })
      ).populate({
        path: 'tuit',
        populate: { path: 'author' },
      });
    } catch (err) {
      throw this.errorHandler.createError(
        BookmarkDaoErrors.DB_ERROR_CREATING_BOOKMARKS,
        err
      );
    }
  };

  /**
   * Find all bookmarks for the specified user in the database. Populate the tuits and tuit authors associated with the bookmarks.
   * @param {string} userId the id of the user
   * @returns an array of IBookMark bookmarks
   */
  findAllByUser = async (userId: string): Promise<IBookmark[]> => {
    try {
      return await this.bookmarkModel.find({ user: userId }).populate({
        path: 'tuit',
        populate: { path: 'author' },
      });
    } catch (err) {
      throw this.errorHandler.createError(
        BookmarkDaoErrors.DB_ERROR_FINDING_BOOKMARKS,
        err
      );
    }
  };

  /**
   * Delete a bookmark document with the bookmark id, and then returned the deleted bookmark to the caller.
   * @param {string} userId the user id
   * @param {string} tuitId the tuit id
   * @returns IBookmark Promise
   */
  delete = async (bookmarkId: string): Promise<IBookmark> => {
    try {
      const deletedBookmark: IBookmark | null =
        await this.bookmarkModel.findOneAndDelete({
          _id: bookmarkId,
        });
      return this.errorHandler.sameObjectOrNullException(
        deletedBookmark,
        BookmarkDaoErrors.NO_BOOK_MARK_FOUND
      );
    } catch (err) {
      throw this.errorHandler.createError(
        BookmarkDaoErrors.DB_ERROR_DELETING_BOOKMARK,
        err
      );
    }
  };
}
