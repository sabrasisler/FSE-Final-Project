import IUser from '../models/users/IUser';

export default interface IDao {
  findAll(): Promise<any[]>;
  findById(uid: string): Promise<any>;
  create(model: any): Promise<any>;
  update(uid: string, model: any): Promise<any>;
  delete(model: any): Promise<any>;
  delete(model: any): Promise<any>;
}
