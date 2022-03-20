import dotenv from 'dotenv';
import DaoErrorHandler from '../../errors/DaoErrorHandler';
import IUser from '../../models/users/IUser';
import UserModel from '../../mongoose/users/UserModel';
import IDao from '../shared/IDao';
import UserDao from './UserDao';
import mongoose, { Mongoose } from 'mongoose';
import { mockUsers } from '../../__mocks__/mockUsers';
import configDatabase from '../../config/configDatabase';
dotenv.config();

beforeAll(async () => {
  await configDatabase(process.env.MONGO_DEV!);
});

afterAll(async () => {
  await mongoose.connection.dropCollection('users');
});

const stripPrivateFields = (users: any[]): any => {
  let output: any[] = [];
  for (const user of users) {
    const dbUser: any = { ...user };
    delete dbUser.password;
    delete dbUser.dateOfBirth;
    delete dbUser.email;
    output.push(dbUser);
  }
  return output;
};
const mockDatabaseUsers = stripPrivateFields(mockUsers);

const userDao: IDao<IUser> = new UserDao(UserModel, new DaoErrorHandler());

describe.only('User Dao', () => {
  test('create()', async () => {
    for (let i = 0; i < mockUsers.length; i++) {
      const dbUser: IUser = await userDao.create(mockUsers[i]);
      expect(dbUser).toMatchObject(mockDatabaseUsers[i]);
    }
  });
  test('findAll()', async () => {
    const dbUsers: IUser[] = await userDao.findAll();
    for (let i = 0; i < dbUsers.length; i++) {
      expect(dbUsers[i]).toMatchObject(mockDatabaseUsers[i]);
    }
  });
  test('findById()', async () => {
    const mockId: string = mockUsers[0]._id;
    const dbUser: IUser = await userDao.findById(mockId);
    expect(dbUser).toMatchObject(mockDatabaseUsers[0]);
  });
  test('update()', async () => {
    const mockId: string = mockUsers[0]._id;
    const update = { ...mockDatabaseUsers[0], bio: 'this is a bio update' };
    const dbUser: IUser = await userDao.update(mockId, update);
    expect(dbUser.bio).toBe(update.bio);
    expect(dbUser).toMatchObject(update);
  });
  test('delete()', async () => {
    const mockId: string = mockUsers[1]._id;
    const deletedDbUser: IUser = await userDao.delete(mockId);
    expect(deletedDbUser).toMatchObject(mockDatabaseUsers[1]);
  });
});
