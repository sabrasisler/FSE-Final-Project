import InvalidEntityException from '../../errors/InvalidEntityException';
import { AccountType } from './AccoutType';
import User from './User';

const getMockUserData = (): any => {
  return {
    username: 'neothematrix',
    name: 'Keanu Reeves',
    password: 'IAmTheOne123!',
    email: 'neo@matrix.com',
    bio: 'I am the one',
    birthday: '1995-01-31',
    headerImage: 'imagestring',
    profilePhoto: 'profilephotostring',
    accountType: 'Personal',
  };
};

const expectError = (message: string, data: any) => {
  test(message, () => {
    expect(() => new User(data)).toThrow(InvalidEntityException);
  });
};

test('User class creates a valid user', () => {
  const mockUserData = getMockUserData();
  const user = new User(mockUserData);
  expect(user.username).toBe(mockUserData.username);
  expect(user.name).toBe(mockUserData.name);
  expect(user.email).toBe(mockUserData.email);
  expect(user.password).toBe(mockUserData.password);
  expect(user.bio).toBe(mockUserData.bio);
  expect(user.birthday.getMonth()).toBe(0);
  expect(user.birthday.getDate()).toBe(31);
  expect(user.birthday.getFullYear()).toBe(1995);
  expect(user.headerImage).toBe(mockUserData.headerImage);
  expect(user.profilePhoto).toBe(mockUserData.profilePhoto);
});

describe('User class throws exception with: ', () => {
  const invalidFields: Record<string, {}> = {
    'undefined username': { username: undefined },
    'username too short': { username: 'no' },
    'undefined first name': { name: undefined },
    'first name too short': { name: 'A' },
    'password too short': { password: 'short' },
    'password undefined': { password: undefined },
    'password without special character': { password: 'MissingSpecialChar' },
    'email undefined': { email: undefined },
    'email without @': { email: 'invalid.com' },
    'email without domain': { email: 'invalid@invalid.' },
    'dob undefined': { birthday: undefined },
    'dob invalid day month': { birthday: '1990-1-1' },
    'dob with slash': { birthday: '2000/12/12' },
    'bio too undefined': { bio: undefined },
    'undefined account type': { accountType: undefined },
    'invalid type': { accountType: 'super' },

    'bio too long': {
      bio: 'Really long bio. Really long bio. Really long bio. Really long bio. Really long bio. Really long bio. Really long bio. Really long bio. Really long bio. Really long bio. Really long bio. Really long bio. Really long bio. Really long bio. Really long bio. Really long bio. Really long bio. Really long bio. Really long bio. Really long bio. Really long bio. Really long bio. Really long bio. Really long bio. Really long bio. Really long bio. Really long bio. Really long bio. Really long bio. Really long bio. Really long bio. Really long bio. Really long bio. Really long bio. Really long bio.',
    },
  };

  for (let key in invalidFields) {
    let mockUserData = getMockUserData();
    mockUserData = { ...mockUserData, ...invalidFields[key] };
    expectError(key, mockUserData);
  }
});
