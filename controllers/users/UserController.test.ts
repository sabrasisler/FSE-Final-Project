import UserDaoMock from '../../mocks/UserDaoMock';
import HttpRequest from '../shared/HttpRequest';
import IGenericController from '../shared/IGenericController';
import { UserController } from './UserController';
import {
  oneMockDbUser as mockDatabaseUser,
  manyMockDbUsers,
} from '../../mocks/mockUsers';
import { HttpStatusCode } from '../shared/HttpStatusCode';
import HttpResponse from '../shared/HttpResponse';

let mockRequest: HttpRequest;
let expectedResponse: HttpResponse;
beforeEach(() => {
  mockRequest = {
    body: {
      username: 'neoIamTheOne',
      firstName: 'Keanu',
      lastName: 'Reeves',
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
    code: HttpStatusCode.ok,
    body: {
      ...mockDatabaseUser,
      id: mockRequest.params.userId,
    },
  };
});
const userController: IGenericController = new UserController(
  new UserDaoMock()
);

describe('User Controller create()', () => {
  test('create(): valid user', async () => {
    const response: HttpResponse = await userController.create(mockRequest);
    expect(response.body).toBe(mockDatabaseUser);
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
    expect(response.body).toBe(manyMockDbUsers);
  });
});
