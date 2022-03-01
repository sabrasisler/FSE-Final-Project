import mongoose from 'mongoose';
import IUser from '../../models/users/IUser';
import { AccountType } from '../../models/users/AccoutType';
import { AccountStatus } from '../../models/users/AccountStatus';

/**
 * Mongoose database schema for the user resource, based on an {@link IUser} interface.
 * @constructor
 * @param {String} username the unique username of the user
 * @param {String} firstName first name
 * @param {String} lastName last name
 * @param {String} password password
 * @param {String} email unique email
 * @param {String} profilePhoto photo URL string
 * @param {String} headerImage header image URL string
 * @param {AccountType} accountType account type
 * @param {AccountStatus} accountStatus account status
 * @param {String} bio biography
 * @param {Date} dateOfBirth date of birth
 * @param {String} longitude longitude
 * @param {String} latitude latitude
 * @module UserSchema
 */
const UserSchema = new mongoose.Schema<IUser>(
  {
    username: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String },
    password: { type: String, select: false, required: true },
    email: { type: String, required: true, unique: true },
    bio: { type: String },
    dateOfBirth: { type: Date, required: true, select: false },
    headerImage: { type: String },
    profilePhoto: { type: String },
    location: { longitude: String, latitude: String, select: false },
    accountType: {
      type: String,
      enum: AccountType,
      required: true,
      select: false,
    },
    accountStatus: {
      type: String,
      enum: AccountStatus,
      required: true,
      default: AccountStatus.Active,
    },
    followerCount: { type: Number, default: 0 },
    followeeCount: { type: Number, default: 0 },
  },
  { timestamps: true, collection: 'users' }
);

export default UserSchema;
