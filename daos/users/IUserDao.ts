import IUser from '../../models/users/IUser';
import IDao from '../shared/IDao';

export interface IUserDao extends IDao<IUser> {
  findByEmail(email: string): Promise<IUser>;
}
