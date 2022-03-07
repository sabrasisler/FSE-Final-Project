import mongoose, { Schema } from 'mongoose';
import DaoDatabaseException from '../../errors/DaoDatabseException';
import MongooseException from '../../errors/MongooseException';
import IFollow from '../../models/follows/IFollow';
import IUser from '../../models/users/IUser';
import UserModel from '../users/UserModel';
import { formatJSON } from '../util/formatJSON';
import FollowModel from './FollowModel';

/**
 * Mongoose schema for the follows resource that takes an {@link IFollow} interface. Contains the a reference to the follower and who the follower is following.
 * @constructor FollowSchema
 * @param {Schema.Types.ObjectId} follower the follower user
 * @param {Schema.Types.ObjectId} following the user being followed
 * @module FollowSchema
 *
 */
const FollowSchema = new mongoose.Schema<IFollow>(
  {
    follower: { type: Schema.Types.ObjectId, ref: 'UserModel', required: true },
    followee: {
      type: Schema.Types.ObjectId,
      ref: 'UserModel',
      required: true,
    },
    accepted: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    timestamps: true,
    collection: 'follows',
  }
);

/**
 * Prevents duplicates.
 */
FollowSchema.index(
  {
    follower: 1,
    followee: 1,
  },
  {
    unique: true,
  }
);

/**
 * Check if users exist before updating follow status to accepted. Then increment follower/followee counts on the user document.
 */
FollowSchema.pre('updateOne', async function (next): Promise<void> {
  const doc: IFollow | null = await FollowModel.findOne(this.getQuery());
  const existingFollower: IUser | null = await UserModel.findOneAndUpdate(
    { _id: doc?.follower },
    { $inc: { followeeCount: 1 } }
  );
  if (existingFollower === null) {
    throw new MongooseException('Follower not found.');
  }
  const existingFollowee: IUser | null = await UserModel.findOneAndUpdate(
    { _id: doc?.followee },
    { $inc: { followerCount: 1 } }
  );
  if (existingFollowee === null) {
    throw new MongooseException('Followee not found.');
  }
});

FollowSchema.pre('remove', async function (next): Promise<void> {
  await UserModel.updateOne(
    { _id: this.follower },
    { $inc: { followeeCount: -1 } }
  );
  await UserModel.updateOne(
    { _id: this.followee },
    { $inc: { followerCount: -1 } }
  );
});

formatJSON(FollowSchema);
export default FollowSchema;
