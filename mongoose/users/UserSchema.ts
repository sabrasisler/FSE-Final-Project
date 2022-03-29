import mongoose from 'mongoose';
import IUser from '../../models/users/IUser';
import { AccountType } from '../../models/users/AccoutType';
import { AccountStatus } from '../../models/users/AccountStatus';
import { formatJSON } from '../util/formatJSON';

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
    username: { type: String },
    name: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    bio: { type: String },
    birthday: { type: Date },
    headerImage: { type: String },
    profilePhoto: { type: String },
    // location: { longitude: String, latitude: String, select: false },
    accountType: {
      type: String,
      enum: AccountType,
      // required: true,
    },
    accountStatus: {
      type: String,
      enum: AccountStatus,
      default: AccountStatus.Active,
    },
    followerCount: { type: Number, default: 0 },
    followeeCount: { type: Number, default: 0 },
  },

  { timestamps: true, collection: 'users' }
);

formatJSON(UserSchema);
export default UserSchema;
