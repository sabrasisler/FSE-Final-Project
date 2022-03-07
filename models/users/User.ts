import IUser from './IUser';
import InvalidEntityException from '../../errors/InvalidEntityException';
import { UserErrorMessages } from './UserErrorMessages';
import { isValidRegex } from '../shared/validateWithRegex';
import { AccountStatus } from './AccountStatus';

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
  public readonly bio: string;
  public readonly dateOfBirth: Date;
  public readonly followerCount: number;
  public readonly followeeCount: number;

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

   */
  public constructor(data: {
    firstName: string;
    lastName: string;
    password: string;
    dateOfBirth: string;
    bio: string;
    username: string;
    email: string;
    accountType?: string;
    headerImage: string;
    profilePhoto: string;
    accountStatus: AccountStatus.Active;
    followerCount: 0;
    followeeCount: 0;
  }) {
    this.validateUsername(data.username);
    this.validateName(data.firstName, data.lastName);
    this.validateEmail(data.email);
    this.validatePassword(data.password);
    this.validateDOB(data.dateOfBirth);
    this.validateBio(data.bio);

    this.username = data.username.trim();
    this.firstName = data.firstName.trim();
    this.lastName = data.lastName.trim();
    this.password = data.password.trim();
    this.email = data.email.toLowerCase().trim();
    this.profilePhoto = data.profilePhoto.trim();
    this.headerImage = data.headerImage.trim();
    this.bio = data.bio.trim();
    this.dateOfBirth = new Date(`<${data.dateOfBirth}>`);
    this.followerCount = 0;
    this.followeeCount = 0;
    Object.freeze(this);
  }

  private validateUsername = (username: string): void => {
    if (
      !isValidRegex(
        username,
        /^(?=[a-zA-Z0-9_]{5,15}$)(?!.*[_.]{2})[^_.].*[^_.]$/
      )
    ) {
      throw new InvalidEntityException(UserErrorMessages.INVALID_USERNAME);
    }
  };

  private validateName = (firstName: string, lastName: string): void => {
    if (
      !firstName ||
      !lastName ||
      firstName.length < 2 ||
      lastName.length < 2 ||
      firstName.length > 50 ||
      lastName.length > 50
    ) {
      throw new InvalidEntityException(UserErrorMessages.INVALID_NAME);
    }
  };

  private validateBio = (bio: string): void => {
    if (!bio || bio.length > 160) {
      throw new InvalidEntityException(UserErrorMessages.INVALID_BIO);
    }
  };

  private validateEmail = (email: string): void => {
    if (!isValidRegex(email, /^[^@\s]+@[^@\s]+\.[^@\s]+$/)) {
      throw new InvalidEntityException(UserErrorMessages.INVALID_EMAIL);
    }
  };

  private validateDOB = (dob: string): void => {
    if (!isValidRegex(dob, /^\d{4}-\d{2}-\d{2}$/)) {
      throw new InvalidEntityException(UserErrorMessages.INVALID_DOB);
    }
  };

  /**
   * Checks if a password adheres to the following rules:
   * The password is at least 8 characters long (?=.{8,}).
   * The password has at least one uppercase letter (?=.*[A-Z]).
   * The password has at least one lowercase letter (?=.*[a-z]).
   * The password has at least one digit (?=.*[0-9]).
   * The password has at least one special character ([^A-Za-z0-9]).
   * @param password
   * @returns true if password conforms to rules; false otherwise.
   */
  private validatePassword = (password: string): void => {
    const valid = new RegExp(
      /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})/
    );
    if (!password || !valid.test(password)) {
      throw new InvalidEntityException(UserErrorMessages.INVALID_PASSWORD);
    }
  };

  // /**
  //  * Checks if the input password equals the one in state.
  //  * @param password the password
  //  * @returns true if the password matches the one state; false if otherwise
  //  */
  // passwordEquals = (password: string): boolean => {
  //   return this.password == password;
  // };
}
