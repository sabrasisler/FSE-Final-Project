import { AccountStatus } from './AccountStatus';
import { AccountType } from './AccoutType';

/**
 * User entity interface
 */
export default interface IUser {
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  email: string;
  bio: string;
  dateOfBirth: Date;
  headerImage: string;
  profilePhoto: string;
  accountType?: AccountType;
  accountStatus?: AccountStatus;
  followerCount: number;
  followeeCount: number;

  // passwordEquals(password: string): boolean;
}
