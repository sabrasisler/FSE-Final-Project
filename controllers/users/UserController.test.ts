import UserDaoMock from '../../__mocks__/UserDaoMock';
import HttpRequest from '../shared/HttpRequest';
import IGenericController from '../shared/IGenericController';
import { UserController } from './UserController';
import { mockUser, mockUsers } from '../../__mocks__/mockUsers';
import { StatusCode } from '../shared/HttpStatusCode';
import HttpResponse from '../shared/HttpResponse';
import express, { Express } from 'express';

const app: Express = express();
let mockRequest: HttpRequest;
let expectedResponse: HttpResponse;
beforeEach(() => {
  mockRequest = {
    body: {
      username: 'neoIamTheOne',
      name: 'Keanu',
      password: 'IAmTheOne123!',
      email: 'neo@matrix.com',
      bio: 'I am the one',
      dateOfBirth: '1990-01-01',
      headerImage: 'imagestring',
      profilePhoto: 'profilephotostring',
      accountType: 'Personal',
    },
    params: { userId: 666 },
  };
  expectedResponse = {
    code: StatusCode.ok,
    body: {
      ...mockUser,
      id: mockRequest.params.userId,
    },
  };
});
const userController: IGenericController = new UserController(
  'mock',
  app,
  new UserDaoMock()
);

describe('User Controller create()', () => {
  test('create(): valid user', async () => {
    const response: HttpResponse = await userController.create(mockRequest);
    expect(response.body).toBe(mockUser);
  });

  test('update()', async () => {
    const actual: HttpResponse = await userController.update(mockRequest);
    expect(actual).toStrictEqual(expectedResponse);
  });

  test('findById()', async () => {
    const actual: HttpResponse = await userController.findById(mockRequest);
    expect(actual).toStrictEqual(expectedResponse);
  });

  test('delete()', async () => {
    const actual: HttpResponse = await userController.delete(mockRequest);
    expect(actual).toStrictEqual(expectedResponse);
  });

  test('findAll()', async () => {
    const response: HttpResponse = await userController.findAll();
    expect(response.body).toBe(mockUsers);
  });
});
