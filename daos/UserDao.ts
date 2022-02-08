import CustomError from '../shared/CustomError';
import IDao from './IDao';
import { DaoErrors } from '../shared/DaoErrors';

export default class UserDao implements IDao {
  public constructor() {}
  test(): void {
    console.log('test working');
  }
  findAll<T>(): Promise<T[]> {
    throw new Error('Method not implemented.');
  }
  findById<T>(): Promise<T> {
    throw new Error('Method not implemented.');
  }
  async create<T>(model: T): Promise<T> {
    console.log('dao working');
    return Promise.resolve(model);
    // throw new CustomError(500, DaoErrors.UNABLE_TO_CREATE_USER, true);
  }
  update<T>(model: T): Promise<T> {
    throw new Error('Method not implemented.');
  }
  delete<T>(model: T): Promise<T> {
    throw new Error('Method not implemented.');
  }
}
