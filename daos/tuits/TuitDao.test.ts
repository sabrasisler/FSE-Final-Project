import dotenv from 'dotenv';
import configDatabase from '../../config/configDatabase';
import IUser from '../../models/users/IUser';
import ITuit from '../../models/tuits/ITuit';
import { mockUser } from '../../__mocks__/mockUsers';
import ITuitDao from './ITuitDao';
import TuitDao from './TuitDao';
import TuitModel from '../../mongoose/tuits/TuitModel';
import DaoErrorHandler from '../../errors/DaoErrorHandler';
import UserModel from '../../mongoose/users/UserModel';
import UserDao from '../users/UserDao';
import IDao from '../shared/IDao';
import mongoose, { ObjectId } from 'mongoose';
import { mockTuits } from '../../__mocks__/mockTuits';

dotenv.config();
let mockAuthor = mockUser;

const mockDbTuits = [
  { ...mockTuits[0], author: { _id: mockAuthor._id } },
  { ...mockTuits[1], author: { _id: mockAuthor._id } },
];
const tuitDao: IDao<ITuit> = new TuitDao(
  TuitModel,
  UserModel,
  new DaoErrorHandler()
);

beforeAll(async () => {
  configDatabase(process.env.MONGO_DEV!);
  const userDao: IDao<IUser> = new UserDao(UserModel, new DaoErrorHandler());
  const createdUser: IUser = await userDao.create(mockAuthor);
});

afterAll(async () => {
  await mongoose.connection.dropCollection('users');
  await mongoose.connection.dropCollection('tuits');
});

const createMockTuit = async (message: string): Promise<ITuit> => {
  return await tuitDao.create({
    tuit: message,
    author: mockAuthor._id,
  });
};

describe('TuitDao', () => {
  test('create(): valid tuit', async () => {
    for (let i = 0; i < mockTuits.length; i++) {
      const dbTuit: ITuit = await tuitDao.create(mockTuits[i]);
      expect(dbTuit).toMatchObject(mockDbTuits[i]);
    }
  });

  test('findAll()', async () => {
    const dbTuits: ITuit[] = await tuitDao.findAll();
    for (let i = 0; i < mockTuits.length; i++) {
      expect(dbTuits[i]).toMatchObject(mockDbTuits[i]);
    }
  });

  test('findByUser(): a valid user with 2 tuits', async () => {
    const userId: string = mockAuthor._id;
    const dbTuits: ITuit[] = await tuitDao.findByField(userId);
    expect(dbTuits.length).toBe(2);
    for (const dbTuit of dbTuits) {
      expect(dbTuit).toMatchObject(userId);
    }
  });
  test('findById(): a valid tuit', async () => {
    const tuitToCreate: any = await createMockTuit('hello!');

    const foundTuit: any = await tuitDao.findById(tuitToCreate.id);
    // console.log(foundTuit.author);
    expect(tuitToCreate.tuit).toStrictEqual(foundTuit.tuit);
    expect(tuitToCreate.author.id).toStrictEqual(foundTuit.author.id);
  });
  test('update(): a valid tuit', async () => {
    const tuitToCreate: any = await createMockTuit('hola world');

    const updatedTuit: any = await tuitDao.update(tuitToCreate.id, {
      tuit: 'updated!',
      author: tuitToCreate.author,
    });
    expect(updatedTuit.tuit).toStrictEqual('updated!');
  });
  test('delete(): a valid tuit', async () => {
    const tuitToCreate: any = await createMockTuit('goodbye world!');

    const deletedTuit: any = await tuitDao.delete(tuitToCreate.id);
    expect(deletedTuit.tuit).toStrictEqual('goodbye world!');
  });
});
