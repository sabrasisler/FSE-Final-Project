import IUser from '../models/users/IUser';

export default interface IDao {
  findAll<T>(): Promise<T[]>;
  findById<T>(): Promise<T>;
  create<T>(model: T): Promise<T>;
  update<T>(model: T): Promise<T>;
  delete<T>(model: T): Promise<T>;
}
