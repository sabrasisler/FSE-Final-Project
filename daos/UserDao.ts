import CustomError from '../shared/CustomError';
import IDao from './IDao';
import { DaoErrors } from '../shared/DaoErrors';
import mongoose, { Model, Error } from 'mongoose';
import IUser from '../models/users/IUser';
import UserModel from '../mongoose/users/UserModel';
import handleError from '../shared/handleError';

export default class UserDao implements IDao {
  private readonly dbUri: string;
  private readonly model: Model<IUser>;

  constructor(dbUri: string, model: Model<IUser>) {
    this.dbUri = dbUri;
    this.model = model;

    Object.freeze(this);
  }

  connect = async (): Promise<void> => {
    try {
      await mongoose.connect(this.dbUri);
      console.log('Connected to db successfully!');
    } catch (err: unknown) {
      handleError(err, DaoErrors.CANNOT_CONNECT_DB);
    }
  };

  async disconnect() {
    try {
      await mongoose.disconnect();
    } catch (err: unknown) {
      handleError(err, DaoErrors.CANNOT_DISCONNECT_DB);
    }
  }
  test(): void {
    console.log('test working');
  }
  findAll<T>(): Promise<T[]> {
    throw new Error('Method not implemented.');
  }
  findById<T>(): Promise<T> {
    throw new Error('Method not implemented.');
  }
  create = <IUser>(user: IUser): Promise<IUser> => {
    this.connect();
    try {
      const newUser = new UserModel(user);
    } catch (err) {
      throw new CustomError(500, DaoErrors.CANNOT_CREATE_USER, true);
    }

    this.disconnect();
    return Promise.resolve(model);
    throw new CustomError(500, DaoErrors.CANNOT_CREATE_USER, true);
  };
  update<T>(model: T): Promise<T> {
    throw new Error('Method not implemented.');
  }
  delete<T>(model: T): Promise<T> {
    throw new Error('Method not implemented.');
  }
}
