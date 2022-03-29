import mongoose, { Schema } from 'mongoose';
import { StatusCode } from '../../controllers/shared/HttpStatusCode';
import MongooseException from '../../errors/MongooseException';
import ILike from '../../models/likes/ILike';
import ITuit from '../../models/tuits/ITuit';
import IUser from '../../models/users/IUser';
import TuitModel from '../tuits/TuitModel';
import UserModel from '../users/UserModel';
import { formatJSON } from '../util/formatJSON';
import LikeModel from './LikeModel';

/**
 * Mongoose schema for the likes resource that takes an {@link ILike} object. The schema contains a user and tuit foreign key references. All fields are required, and created/updated time stamps are added.
 * @constructor LikeSchema
 * @param {Schema.Types.ObjectId} user the user foreign key
 * @param {Schema.Types.ObjectId} tuit the tuit foreign key
 * @module LikeSchema
 *
 */
const LikeSchema = new mongoose.Schema<ILike>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'UserModel', required: true },
    tuit: { type: Schema.Types.ObjectId, ref: 'TuitModel', required: true },
  },
  {
    timestamps: true,
    collection: 'likes',
  }
);

/**
 * A like document be unique by user and tuit to avoid duplicates.
 */
LikeSchema.index(
  {
    user: 1,
    tuit: 1,
  },
  { unique: true }
);
/**
 * Check if users exist before creating like.
 */
LikeSchema.pre('save', async function (next): Promise<void> {
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

// LikeSchema.post('deleteOne', async function (next): Promise<void> {
//   const tuitId = this.getQuery().tuit;
//   const existingTuit: ITuit | null = await TuitModel.findOneAndUpdate(
//     { _id: tuitId, stats: { likes: { $gt: 0 } } },
//     { $inc: { 'stats.dislikes': 1, 'stats.likes': -1 } }
//   );
//   if (existingTuit === null) {
//     throw new MongooseException(
//       'Unable to update tuit stats after unlike: Tuit not found.'
//     );
//   }
// });

formatJSON(LikeSchema);
export default LikeSchema;
