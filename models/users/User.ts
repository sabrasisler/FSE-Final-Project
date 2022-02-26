import { stringify } from 'querystring';
import { AccountStatus } from './AccountStatus';
import { AccountType } from './AccoutType';
import { ILocation } from './ILocation';
import { Location } from './Location';
import IUser from './IUser';

/**
 * Represents a user model entity containing all basic information related to to a user.
 * @implements {IUser}.
 */

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
  /**
   * Constructs the user object all information related to the user.
   * @param {string} username the unique username of the user
   * @param {string} firstName first name
   * @param {string} lastName last name
   * @param {string} password password
   * @param {string} email unique email
   * @param {string} profilePhoto photo URL string
   * @param {string} headerImage header image URL string
   * @param {string} accountType account type
   * @param {string} bio biography
   * @param {string} dateOfBirth date of birth
   * @param {string} longitude longitude
   * @param {string} latitude latitude
   */
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
    longitude: number,
    latitude: number
  ) {
    this.username = username;
    this.firstName = firstName;
    this.lastName = lastName;
    this.password = password;
    this.email = email;
    this.profilePhoto = profilePhoto;
    this.headerImage = headerImage;
    const type: AccountType = accountType as AccountType;
    this.accountType = type;
    this.accountStatus = AccountStatus.Active;
    this.bio = bio;
    this.dateOfBirth = new Date(dateOfBirth);
    this.location = new Location(longitude, latitude);
    Object.freeze(this);
  }
  /**
   * Checks if the input password equals the one in state.
   * @param password the password
   * @returns true if the password matches the one state; false if otherwise
   */
  passwordEquals(password: string): boolean {
    return this.password == password;
  }
}
