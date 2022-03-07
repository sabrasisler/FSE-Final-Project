import IUser from '../models/users/IUser';
import IDao from '../daos/IDao';
import { oneMockDbUser, manyMockDbUsers } from './mockUsers';

export default class MockUserDao implements IDao<IUser> {
  findAll(): Promise<IUser[]> {
    return Promise.resolve(manyMockDbUsers);
  }
  findById(id: string): Promise<IUser> {
    return Promise.resolve({ ...oneMockDbUser, id });
  }
  create = async (user: IUser): Promise<IUser> => {
    return Promise.resolve(oneMockDbUser);
  };
  update(id: string, user: IUser): Promise<IUser> {
    console.log(user.bio);
    return Promise.resolve({ ...oneMockDbUser, bio: user.bio, id });
  }
  delete(id: string): Promise<IUser> {
    return Promise.resolve({ ...oneMockDbUser, id });
  }
}
