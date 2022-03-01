import ITuitDao from './ITuitDao';
import { Model } from 'mongoose';
import ITuit from '../../models/tuits/ITuit';
import IErrorHandler from '../../errors/IErrorHandler';
import { TuitDaoErrors } from './TuitDaoErrors';

/**
 * DAO database CRUD operations for the tuit resource. Takes the injected dependencies of a {@link Model<ITuit>} ORM model and an {@link IErrorHandler} error handler.
 */
export default class TuitDao implements ITuitDao {
  private readonly model: Model<ITuit>;
  private readonly errorHandler: IErrorHandler;

  /**
   * Builds the DAO by setting model and error handler injected dependencies to state.
   * @param {TuitModel} TuitModel the Mongoose tuit model
   * @param {IErrorHandler} errorHandler the error handler to deal with all errors that might occur
   */
  public constructor(tuitModel: Model<ITuit>, errorHandler: IErrorHandler) {
    this.model = tuitModel;
    this.errorHandler = errorHandler;
    Object.freeze(this); // Make this object immutable.
  }

  /**
   * Finds all tuits belonging by a user id in the database. Populates the tuit author in the document.
   * @param {string} userId the id of the user.
   * @returns an array of all tuits by the user id, with author user populated
   */
  findByUser = async (userId: string): Promise<ITuit> => {
    try {
      const tuit = await this.model
        .findOne({ author: userId })
        .populate('author');
      return this.errorHandler.handleNull(tuit, TuitDaoErrors.TUIT_NOT_FOUND);
    } catch (err) {
      throw this.errorHandler.handleError(
        TuitDaoErrors.DB_ERROR_FINDING_TUITS,
        err
      );
    }
  };

  /**
   * Finds all tuits in the database.
   * @returns an array of tuits
   */
  findAll = async (): Promise<ITuit[]> => {
    try {
      return await this.model.find().populate('author');
    } catch (err) {
      throw this.errorHandler.handleError(
        TuitDaoErrors.DB_ERROR_FINDING_TUITS,
        err
      );
    }
  };

  /**
   * Finds a single tuit in the database by its specified id.
   * @param {string} tuitId the id of the tuit
   * @returns the tuit
   */
  findById = async (tuitId: string): Promise<ITuit> => {
    try {
      const tuit = await this.model.findById(tuitId);
      return this.errorHandler.handleNull(tuit, TuitDaoErrors.TUIT_NOT_FOUND);
    } catch (err) {
      throw this.errorHandler.handleError(
        TuitDaoErrors.DB_ERROR_FINDING_TUITS,
        err
      );
    }
  };

  /**
   * Create a new tuit document with all its data by calling the Mongoose TuitModel.
   * @param {ITuit} tuit the new tuit
   * @returns the newly created tuit
   */
  create = async (tuit: ITuit): Promise<ITuit> => {
    console.log(tuit);
    try {
      const newTuit = await this.model.create({
        ...tuit,
      });
      return newTuit;
    } catch (err) {
      throw this.errorHandler.handleError(
        TuitDaoErrors.DB_ERROR_CREATING_TUIT,
        err
      );
    }
  };

  /**
   * Updates a tuit in the database by its id.
   * @param {string} tuitId the id of the tuit
   * @param {ITuit} tuit the tuit with the information used for the update.
   * @returns the updated tuit
   */
  update = async (tuitId: string, tuit: any): Promise<ITuit> => {
    try {
      const updatedTuit = await this.model.findOneAndUpdate(
        { _id: tuitId },
        tuit,
        {
          new: true,
        }
      );
      return this.errorHandler.handleNull(
        updatedTuit,
        TuitDaoErrors.TUIT_NOT_FOUND
      );
    } catch (err) {
      throw this.errorHandler.handleError(
        TuitDaoErrors.DB_ERROR_UPDATING_TUIT,
        err
      );
    }
  };

  /**
   * Deletes a particular tuit from the database.
   * @param {string} tuitId the id of the tuit.
   * @returns the deleted tuit
   */
  delete = async (tuitId: string): Promise<ITuit> => {
    try {
      const deletedTuit = await this.model.findByIdAndDelete(tuitId);
      return this.errorHandler.handleNull(
        deletedTuit,
        TuitDaoErrors.TUIT_NOT_FOUND
      );
    } catch (err) {
      throw this.errorHandler.handleError(
        TuitDaoErrors.DB_ERROR_DELETING_TUIT,
        err
      );
    }
  };
}
