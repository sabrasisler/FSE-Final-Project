import CustomError from '../shared/CustomError';
import IDao from './IDao';
import { DaoErrors } from './DaoErrors';
import mongoose, { Model, Error } from 'mongoose';
import IUser from '../models/users/IUser';
import UserModel from '../mongoose/users/UserModel';
import handleError from '../shared/handleError';
import { UserController } from '../controllers/UserController';

export default class UserDao implements IDao {
  private readonly model: Model<IUser>;

  constructor(model: Model<IUser>) {
    this.model = model;
    Object.freeze(this);
  }

  test(): void {
    console.log('test working');
  }
  findAll = async (): Promise<IUser[]> => {
    try {
      const dbUsers = await this.model.find().exec();
      return dbUsers;
    } catch (err) {
      throw handleError(err, DaoErrors.ERROR_FINDING_ALL_USERS);
    }
  };
  findById = async (uid: string): Promise<IUser | null> => {
    try {
      const dbUser = await this.model.findById(uid);
      return dbUser;
    } catch (err) {
      throw handleError(err, DaoErrors.ERROR_FINDING_USER);
    }
  };

  create = async (user: IUser): Promise<IUser> => {
    try {
      const existingUser = this.model.findOne({ email: user.email });
      if (existingUser != null) {
        throw new CustomError(409, DaoErrors.USER_ALREADY_EXISTS, true);
      }
      const dbUser = await this.model.create(user);
      return dbUser;
    } catch (err) {
      throw handleError(err, DaoErrors.CANNOT_SAVE_TO_DB);
    }
  };
  update = async (uid: string, user: IUser): Promise<any> => {
    try {
      const updatedUser = await this.model.findOneAndUpdate(
        { _id: uid },
        user,
        {
          new: true,
        }
      );
      return updatedUser;
    } catch (err) {
      throw handleError(err, DaoErrors.CANNOT_SAVE_TO_DB);
    }
  };
  delete<T>(model: T): Promise<T> {
    throw new Error('Method not implemented.');
  }
}
