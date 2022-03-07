import InvalidEntityException from '../../errors/InvalidEntityException';
import { AccountType } from './AccoutType';
import User from './User';

const getMockUserData = (): any => {
  return {
    username: 'neothematrix',
    firstName: 'Keanu',
    lastName: 'Reeves',
    password: 'IAmTheOne123!',
    email: 'neo@matrix.com',
    bio: 'I am the one',
    dateOfBirth: '1995-01-31',
    headerImage: 'imagestring',
    profilePhoto: 'profilephotostring',
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
  expect(user.firstName).toBe(mockUserData.firstName);
  expect(user.lastName).toBe(mockUserData.lastName);
  expect(user.email).toBe(mockUserData.email);
  expect(user.password).toBe(mockUserData.password);
  expect(user.bio).toBe(mockUserData.bio);
  expect(user.dateOfBirth.getMonth()).toBe(0);
  expect(user.dateOfBirth.getDate()).toBe(31);
  expect(user.dateOfBirth.getFullYear()).toBe(1995);
  expect(user.headerImage).toBe(mockUserData.headerImage);
  expect(user.profilePhoto).toBe(mockUserData.profilePhoto);
});

describe('User class throws exception with: ', () => {
  const invalidFields: Record<string, {}> = {
    'undefined username': { username: undefined },
    'username too short': { username: 'no' },
    'undefined first name': { firstName: undefined },
    'first name too short': { firstName: 'A' },
    'last name undefined': { lastName: undefined },
    'last name too short': { lastName: 'B' },
    'password too short': { password: 'short' },
    'password undefined': { password: undefined },
    'password without special character': { password: 'MissingSpecialChar' },
    'email undefined': { email: undefined },
    'email without @': { email: 'invalid.com' },
    'email without domain': { email: 'invalid@invalid.' },
    'dob undefined': { dateOfBirth: undefined },
    'dob invalid day month': { dateOfBirth: '1990-1-1' },
    'dob with slash': { dateOfBirth: '2000/12/12' },
    'bio too undefined': { bio: undefined },

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
