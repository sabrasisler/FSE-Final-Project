import { AccountStatus } from './AccountStatus';
import { AccountType } from './AccoutType';
import { ILocation } from './ILocation';

/**
 * User entity interface
 */
export default interface IUser {
  _id: number;
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  email: string;
  profilePhoto: string;
  headerImage: string;
  accountType: AccountType;
  accountStatus: AccountStatus;
  bio: string;
  dateOfBirth: Date;
  location: ILocation;
  followerCount: number;
  followeeCount: number;

  passwordEquals(password: string): boolean;
}
