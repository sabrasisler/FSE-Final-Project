import { stringify } from 'querystring';
import { AccountStatus } from './AccountStatus';
import { AccountType } from './AccoutType';
import { ILocation } from './ILocation';
import { Location } from './Location';
import IUser from './IUser';

export default class User implements IUser {
  public readonly username: string;
  public readonly password: string;
  public readonly firstName: string;
  public readonly lastName: string;
  public readonly email: string;
  public readonly profilePhoto: string;
  public readonly headerImage: string;
  public readonly accountType: AccountType;
  public readonly accountStatus: AccountStatus;
  public readonly bio: string;
  public readonly dateOfBirth: Date;
  public readonly location: ILocation;

  public constructor(
    username: string,
    firstName: string,
    lastName: string,
    password: string,
    email: string,
    profilePhoto: string,
    headerImage: string,
    accountType: string,
    bio: string,
    dateOfBirth: string,
    logitude: number,
    latitude: number
  ) {
    this.username = username;
    this.firstName = firstName;
    this.lastName = lastName;
    this.password = password;
    this.email = email;
    this.profilePhoto = profilePhoto;
    this.headerImage = headerImage;
    this.accountType = AccountType.Personal;
    this.accountStatus = AccountStatus.Active;
    this.bio = bio;
    this.dateOfBirth = new Date(dateOfBirth);
    this.location = new Location(logitude, latitude);
    Object.freeze(this);
  }
  passwordEquals(password: string): boolean {
    return this.password == password;
  }
}
