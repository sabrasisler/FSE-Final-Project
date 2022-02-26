import CustomError from '../../errors/CustomError';
import IDao from '../IDao';
import { UserDaoErrors } from '../../errors/UserDaoErrors';
import { Model } from 'mongoose';
import IUser from '../../models/users/IUser';
import IErrorHandler from '../../errors/IErrorHandler';

/**
 * DAO database CRUD operations for the user resource. Takes the injected dependencies of a {@link Model<IUser>} ORM model and an {@link IErrorHandler} error handler.
 */
export default class UserDao implements IDao<IUser> {
  private readonly model: Model<IUser>;
  private readonly errorHandler: IErrorHandler;

  /**
   * Builds the DAO by setting model and error handler injected dependencies to state.
   * @param {UserModel} UserModel the Mongoose user model
   * @param {IErrorHandler} errorHandler the error handler to deal with all errors that might occur
   */
  constructor(model: Model<IUser>, errorHandler: IErrorHandler) {
    this.model = model;
    this.errorHandler = errorHandler;
    Object.freeze(this);
  }

  /**
   * Finds all users in the database.
   * @returns an array of all users.
   */
  findAll = async (): Promise<IUser[]> => {
    try {
      const dbUsers = await this.model.find().exec();
      return this.errorHandler.sameObjectOrNullException(
        dbUsers,
        UserDaoErrors.USER_NOT_FOUND
      );
    } catch (err) {
      throw this.errorHandler.createError(
        UserDaoErrors.DB_ERROR_FINDING_ALL_USERS,
        err
      );
    }
  };

  /**
   * Finds a single user in the database by its specified id.
   * @param {string} userId the id of the user
   * @returns the user
   */
  findById = async (uid: string): Promise<IUser> => {
    try {
      const dbUser: IUser | null = await this.model.findById(uid);
      return this.errorHandler.sameObjectOrNullException(
        dbUser,
        UserDaoErrors.USER_DOES_NOT_EXIST
      );
    } catch (err) {
      throw this.errorHandler.createError(
        UserDaoErrors.DB_ERROR_FINDING_USER,
        err
      );
    }
  };

  /**
   * Create a new user document with all its data by calling the Mongoose UserModel.
   * @param {string} user the new user
   * @returns the newly created user
   */
  create = async (user: IUser): Promise<IUser> => {
    try {
      const newUser: IUser | null = await this.model.findOneAndUpdate(
        { email: user.email },
        user,
        {
          upsert: true,
          new: true,
        }
      );
      return this.errorHandler.sameObjectOrNullException(
        newUser,
        UserDaoErrors.USER_NOT_FOUND
      );
    } catch (err) {
      throw this.errorHandler.createError(
        UserDaoErrors.DB_ERROR_CREATING_USER,
        err
      );
    }
  };

  /**
   * Updates a user in the database by its id.
   * @param {string} userId the id of the user
   * @param {IUser} user the user with the information used for the update.
   * @returns the updated user
   */
  update = async (uid: string, user: any): Promise<IUser> => {
    try {
      const updatedUser: IUser | null = await this.model.findOneAndUpdate(
        { _id: uid },
        user,
        {
          new: true,
        }
      );
      return this.errorHandler.sameObjectOrNullException(
        updatedUser,
        UserDaoErrors.NO_USER_TO_UPDATE
      );
    } catch (err) {
      throw this.errorHandler.createError(
        UserDaoErrors.DB_ERROR_CREATING_USER,
        err
      );
    }
  };

  /**
   * Deletes a particular user from the database.
   * @param userId the id of the user.
   * @returns the deleted user
   */
  delete = async (uid: string): Promise<IUser> => {
    try {
      const deletedUser: IUser | null = await this.model.findByIdAndDelete(uid);
      return this.errorHandler.sameObjectOrNullException(
        deletedUser,
        UserDaoErrors.USER_DOES_NOT_EXIST
      );
    } catch (err) {
      throw this.errorHandler.createError(
        UserDaoErrors.CANNOT_DELETE_USER,
        err
      );
    }
  };
}
