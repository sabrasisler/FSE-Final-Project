import CustomError from '../../errors/CustomError';
import IDao from '../IDao';
import { DaoErrors } from '../../errors/UserDaoErrors';
import { Model } from 'mongoose';
import IUser from '../../models/users/IUser';
import IErrorHandler from '../../errors/IErrorHandler';

export default class UserDao implements IDao<IUser> {
  private readonly model: Model<IUser>;
  private readonly errorHandler: IErrorHandler;
  constructor(model: Model<IUser>, errorHandler: IErrorHandler) {
    this.model = model;
    this.errorHandler = errorHandler;
    Object.freeze(this);
  }
  findAll = async (): Promise<IUser[]> => {
    try {
      const dbUsers = await this.model.find().exec();
      return this.errorHandler.sameObjectOrNullException(
        dbUsers,
        DaoErrors.USER_NOT_FOUND
      );
    } catch (err) {
      throw this.errorHandler.createError(
        DaoErrors.DB_ERROR_FINDING_ALL_USERS,
        err
      );
    }
  };
  findById = async (uid: string): Promise<IUser> => {
    try {
      const dbUser: IUser | null = await this.model.findById(uid);
      return this.errorHandler.sameObjectOrNullException(
        dbUser,
        DaoErrors.USER_DOES_NOT_EXIST
      );
    } catch (err) {
      throw this.errorHandler.createError(DaoErrors.DB_ERROR_FINDING_USER, err);
    }
  };

  create = async (user: IUser): Promise<IUser> => {
    try {
      const newUser: IUser | null = await this.model.findOneAndUpdate(
        { email: user.email },
        user,
        {
          upsert: true,
        }
      );
      return this.errorHandler.sameObjectOrNullException(
        newUser,
        DaoErrors.USER_NOT_FOUND
      );
    } catch (err) {
      throw this.errorHandler.createError(
        DaoErrors.DB_ERROR_CREATING_USER,
        err
      );
    }
  };
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
        DaoErrors.NO_USER_TO_UPDATE
      );
    } catch (err) {
      throw this.errorHandler.createError(
        DaoErrors.DB_ERROR_CREATING_USER,
        err
      );
    }
  };
  delete = async (uid: string): Promise<IUser> => {
    try {
      const deletedUser: IUser | null = await this.model.findByIdAndDelete(uid);
      return this.errorHandler.sameObjectOrNullException(
        deletedUser,
        DaoErrors.USER_DOES_NOT_EXIST
      );
    } catch (err) {
      throw this.errorHandler.createError(DaoErrors.CANNOT_DELETE_USER, err);
    }
  };
}
