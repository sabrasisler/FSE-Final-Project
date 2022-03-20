import { AccountStatus } from './AccountStatus';
import { AccountType } from './AccoutType';

/**
 * User entity interface
 */
export default interface IUser {
  username: string;
  password: string;
  name: string;
  email: string;
  bio: string;
  birthday: Date;
  headerImage: string;
  profilePhoto: string;
  accountType: AccountType;
  accountStatus?: AccountStatus;
  followerCount?: number;
  followeeCount?: number;

  // passwordEquals(password: string): boolean;
}
