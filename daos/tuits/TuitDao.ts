import ITuitDao from './ITuitDao';
import { Model } from 'mongoose';
import ITuit from '../../models/tuits/ITuit';
import IErrorHandler from '../../errors/IErrorHandler';
import { TuitDaoErrors } from './TuitDaoErrors';
import IUser from '../../models/users/IUser';
import Tuit from '../../models/tuits/Tuit';
import DaoNullException from '../../errors/DaoNullException';

/**
 * DAO database CRUD operations for the tuit resource. Takes the injected dependencies of a {@link Model<ITuit>} ORM model and an {@link IErrorHandler} error handler.
 */
export default class TuitDao implements ITuitDao {
  private readonly tuitModel: Model<ITuit>;
  private readonly userModel: Model<IUser>;
  private readonly errorHandler: IErrorHandler;

  /**
   * Builds the DAO by setting model and error handler injected dependencies to state.
   * @param {TuitModel} TuitModel the Mongoose tuit model
   * @param {IErrorHandler} errorHandler the error handler to deal with all errors that might occur
   */
  public constructor(
    tuitModel: Model<ITuit>,
    userModel: Model<IUser>,
    errorHandler: IErrorHandler
  ) {
    this.tuitModel = tuitModel;
    this.userModel = userModel;
    this.errorHandler = errorHandler;
    Object.freeze(this); // Make this object immutable.
  }

  /**
   * Finds all tuits belonging by a user id in the database. Populates the tuit author in the document.
   * @param {string} userId the id of the user.
   * @returns an array of all tuits by the user id, with author user populated
   */
  findByUser = async (userId: string): Promise<ITuit[]> => {
    try {
      const tuits = await this.tuitModel
        .find({ author: userId })
        .populate('author');
      return this.errorHandler.objectOrNullException(
        tuits,
        TuitDaoErrors.TUIT_NOT_FOUND
      );
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
      return await this.tuitModel
        .find()
        .sort({ createdAt: 'descending' })
        .populate('author');
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
      const tuit = await this.tuitModel.findById(tuitId).populate('author');
      return this.errorHandler.objectOrNullException(
        tuit,
        TuitDaoErrors.TUIT_NOT_FOUND
      );
    } catch (err) {
      throw this.errorHandler.handleError(
        TuitDaoErrors.DB_ERROR_FINDING_TUITS,
        err
      );
    }
  };

  exists = async (tuit: ITuit): Promise<boolean> => {
    try {
      const dbTuit: IUser | null = await this.tuitModel.findOne({
        tuit: tuit.tuit,
        author: tuit.author,
      });
      if (dbTuit === null) return false;
      else return true;
    } catch (err) {
      throw this.errorHandler.handleError(TuitDaoErrors.DB_ERROR_EXISTS, err);
    }
  };

  /**
   * Create a new tuit document with all its data by calling the Mongoose TuitModel.
   * @param {ITuit} tuitData the new tuit
   * @returns the newly created tuit
   */
  create = async (tuitData: ITuit): Promise<ITuit> => {
    try {
      // Check if user exists first.
      const existingUser: IUser | null = await this.userModel.findById(
        tuitData.author
      );

      if (existingUser === null) {
        throw new DaoNullException(TuitDaoErrors.NO_USER_FOUND);
      } else {
        // Validate tuit and create.
        const validatedTuit: ITuit = new Tuit(tuitData.tuit, existingUser);
        const newTuit = await (
          await this.tuitModel.create(validatedTuit)
        ).populate('author');

        return newTuit;
      }
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
  update = async (tuitId: string, tuit: ITuit): Promise<ITuit> => {
    try {
      const updatedTuit: ITuit | null = await this.tuitModel.findOneAndUpdate(
        { _id: tuitId },
        { tuit: tuit.tuit },
        {
          new: true,
        }
      );
      return this.errorHandler.objectOrNullException(
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
  delete = async (tuitId: string): Promise<number> => {
    try {
      const tuitToDelete = await this.tuitModel.deleteOne({ _id: tuitId });
      return tuitToDelete.deletedCount;
    } catch (err) {
      throw this.errorHandler.handleError(
        TuitDaoErrors.DB_ERROR_DELETING_TUIT,
        err
      );
    }
  };
}
