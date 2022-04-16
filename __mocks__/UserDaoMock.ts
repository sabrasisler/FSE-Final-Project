import IUser from '../models/users/IUser';
import IDao from '../daos/shared/IDao';
import { mockUser, mockUsers } from './mockUsers';

export default class MockUserDao implements IDao<IUser> {
  findAllByField(field: string): Promise<any> {
    throw new Error('Method not implemented.');
  }
  findByField(field: string): Promise<any> {
    throw new Error('Method not implemented.');
  }
  exists(resource: IUser): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
  findAll(): Promise<IUser[]> {
    return Promise.resolve(mockUsers);
  }
  findById(id: string): Promise<IUser> {
    return Promise.resolve({ ...mockUser, id });
  }
  create = async (user: IUser): Promise<IUser> => {
    return Promise.resolve(mockUser);
  };
  update(id: string, user: IUser): Promise<IUser> {
    return Promise.resolve({ ...mockUser, bio: user.bio, id });
  }
  delete(id: string): Promise<IUser> {
    return Promise.resolve({ ...mockUser, id });
  }
}
