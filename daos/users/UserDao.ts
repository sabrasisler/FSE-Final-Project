import CustomError from '../../shared/CustomError';
import IDao from '../IDao';
import { DaoErrors } from '../DaoErrors';
import { Model } from 'mongoose';
import IUser from '../../models/users/IUser';

import { HttpStatusCode } from '../../controllers/HttpStatusCode';
import ErrorHandler from '../../shared/ErrorHandler';
import User from '../../models/users/User';

export default class UserDao implements IDao {
  private readonly model: Model<IUser>;
  constructor(model: Model<IUser>) {
    this.model = model;
    Object.freeze(this);
  }
  findAll = async (): Promise<IUser[]> => {
    try {
      const dbUsers = await this.model.find().exec();
      return dbUsers;
    } catch (err) {
      throw ErrorHandler.createError(err, DaoErrors.ERROR_FINDING_ALL_USERS);
    }
  };
  findById = async (uid: string): Promise<IUser | null> => {
    try {
      const dbUser = await this.model.findById(uid);
      if (dbUser == null) {
        throw new CustomError(
          HttpStatusCode.notFound,
          DaoErrors.USER_DOES_NOT_EXIST,
          true
        );
      }
      return dbUser;
    } catch (err) {
      throw ErrorHandler.createError(err, DaoErrors.ERROR_FINDING_USER);
    }
  };

  create = async (data: any): Promise<IUser> => {
    let existingUser = null;
    try {
      existingUser = await this.model.findOne({ email: data.email });
    } catch (err) {
      throw ErrorHandler.createError(err, DaoErrors.CANNOT_SAVE_TO_DB);
    }
    if (existingUser != null) {
      throw new CustomError(
        HttpStatusCode.conflict,
        DaoErrors.USER_ALREADY_EXISTS,
        true
      );
    }
    try {
      const user = new User(
        data.username,
        data.firstName,
        data.lastName,
        data.password,
        data.email,
        data.profilePhoto,
        data.headerImage,
        data.accountType,
        data.bio,
        data.dateOfBirth,
        data.longitude,
        data.latitude
      );
      const dbUser = await this.model.create(user);
      return dbUser;
    } catch (err) {
      throw ErrorHandler.createError(err, DaoErrors.CANNOT_SAVE_TO_DB);
    }
  };
  update = async (uid: string, user: any): Promise<any> => {
    try {
      const updatedUser = await this.model.findOneAndUpdate(
        { _id: uid },
        user,
        {
          new: true,
        }
      );
      if (updatedUser == null) {
        throw new CustomError(
          HttpStatusCode.badRequest,
          DaoErrors.NO_USER_TO_UPDATE,
          true
        );
      }
      return updatedUser;
    } catch (err) {
      throw ErrorHandler.createError(err, DaoErrors.CANNOT_SAVE_TO_DB);
    }
  };
  delete = async (uid: string): Promise<IUser | null> => {
    let deletedUser = null;
    try {
      deletedUser = await this.model.findByIdAndDelete(uid);
      if (deletedUser == null) {
        throw new CustomError(
          HttpStatusCode.badRequest,
          DaoErrors.USER_DOES_NOT_EXIST,
          true
        );
      }
    } catch (err) {
      ErrorHandler.createError(err, DaoErrors.CANNOT_DELETE_USER);
    }
    return deletedUser;
  };
}
