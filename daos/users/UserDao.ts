import CustomError from '../../shared/CustomError';
import IDao from '../IDao';
import { DaoErrors } from '../DaoErrors';
import { Model } from 'mongoose';
import IUser from '../../models/users/IUser';
import ErrorHandler from '../../shared/ErrorHandler';

export default class UserDao implements IDao<IUser> {
  private readonly model: Model<IUser>;
  constructor(model: Model<IUser>) {
    this.model = model;
    Object.freeze(this);
  }
  findAll = async (): Promise<IUser[]> => {
    try {
      const dbUsers = await this.model.find().exec();
      return ErrorHandler.returnObjectOrNullError(
        dbUsers,
        DaoErrors.USER_NOT_FOUND
      );
    } catch (err) {
      throw ErrorHandler.createError(DaoErrors.DB_ERROR_FINDING_ALL_USERS, err);
    }
  };
  findById = async (uid: string): Promise<IUser> => {
    try {
      const dbUser: IUser | null = await this.model.findById(uid);
      return ErrorHandler.returnObjectOrNullError(
        dbUser,
        DaoErrors.USER_DOES_NOT_EXIST
      );
    } catch (err) {
      throw ErrorHandler.createError(DaoErrors.DB_ERROR_FINDING_USER, err);
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
      return ErrorHandler.returnObjectOrNullError(
        newUser,
        DaoErrors.USER_NOT_FOUND
      );
    } catch (err) {
      throw ErrorHandler.createError(DaoErrors.DB_ERROR_CREATING_USER, err);
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
      return ErrorHandler.returnObjectOrNullError(
        updatedUser,
        DaoErrors.NO_USER_TO_UPDATE
      );
    } catch (err) {
      throw ErrorHandler.createError(DaoErrors.DB_ERROR_CREATING_USER, err);
    }
  };
  delete = async (uid: string): Promise<IUser> => {
    try {
      const deletedUser: IUser | null = await this.model.findByIdAndDelete(uid);
      return ErrorHandler.returnObjectOrNullError(
        deletedUser,
        DaoErrors.USER_DOES_NOT_EXIST
      );
    } catch (err) {
      throw ErrorHandler.createError(DaoErrors.CANNOT_DELETE_USER, err);
    }
  };
}
