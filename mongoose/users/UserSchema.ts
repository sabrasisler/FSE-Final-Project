import mongoose from 'mongoose';
import IUser from '../../models/users/IUser';
import { AccountType } from '../../models/users/AccoutType';
import { AccountStatus } from '../../models/users/AccountStatus';

const UserSchema = new mongoose.Schema<IUser>(
  {
    username: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    bio: { type: String },
    dateOfBirth: { type: Date, required: true },
    headerImage: { type: String },
    profilePhoto: { type: String },
    location: { longitude: String, latitude: String },
    accountType: { type: String, enum: AccountType, required: true },
    accountStatus: {
      type: String,
      num: AccountStatus,
      required: true,
      default: AccountStatus.Active,
    },
  },
  { timestamps: true, collection: 'users' }
);

export default UserSchema;
