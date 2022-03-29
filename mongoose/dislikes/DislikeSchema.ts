import mongoose, { Schema } from 'mongoose';

import MongooseException from '../../errors/MongooseException';
import ILike from '../../models/likes/ILike';
import ITuit from '../../models/tuits/ITuit';
import IUser from '../../models/users/IUser';
import TuitModel from '../tuits/TuitModel';
import UserModel from '../users/UserModel';
import { formatJSON } from '../util/formatJSON';

const DislikeSchema = new mongoose.Schema<ILike>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'UserModel', required: true },
    tuit: { type: Schema.Types.ObjectId, ref: 'TuitModel', required: true },
  },
  {
    timestamps: true,
    collection: 'dislikes',
  }
);

/**
 * A like document be unique by user and tuit to avoid duplicates.
 */
DislikeSchema.index(
  {
    user: 1,
    tuit: 1,
  },
  { unique: true }
);
/**
 * Check if users exist before creating like.
 */
DislikeSchema.pre('save', async function (next): Promise<void> {
  const existingUser: IUser | null = await UserModel.findById(this.user);
  if (existingUser === null) {
    throw new MongooseException('User not found.');
  }
  const existingTuit: ITuit | null = await TuitModel.findOne({
    _id: this.tuit,
  });
  if (existingTuit === null) {
    throw new MongooseException('Tuit not found.');
  }
});

formatJSON(DislikeSchema);
export default DislikeSchema;
