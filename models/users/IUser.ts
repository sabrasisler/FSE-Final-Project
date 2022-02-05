import { AccountStatus } from '../AccountStatus';
import { AccountType } from '../AccoutType';
import { ILocation } from './ILocation';

export default interface IUser {
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  email: string;
  profilePhoto: string;
  headerImage: string;
  accountType: AccountType;
  accountStatus: AccountStatus;
  biography: string;
  dateOfBirth: Date;
  location: ILocation;
  passwordEquals(password: string): boolean;
}
