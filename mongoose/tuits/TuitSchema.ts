import mongoose, { Schema } from 'mongoose';
import MongooseException from '../../errors/MongooseException';
import ITuit from '../../models/tuits/ITuit';
import BookmarkModel from '../bookmarks/BookmarkModel';
import DislikeModel from '../dislikes/DislikeModel';
import LikeModel from '../likes/LikeModel';
import UserModel from '../users/UserModel';
import UserSchema from '../users/UserSchema';
import { formatJSON } from '../util/formatJSON';

/**
 *  Mongoose database schema for the tuit resource, based on an {@link ITuit} interface.
 * @constructor
 * @param {Schema.Types.ObjectId} author foreign key to user who created the tuit, ref to {@link UserModel}
 * @param {String} tuit the contents of the tuit
 * @param {Date} postedDate date the tuit was posted
 * @param {Number} likeCount number of likes this tuit has
 * @param {Number} replyCount number of replies this tuit has
 * @module TuitSchema
 *
 */
const TuitSchema = new mongoose.Schema<ITuit>(
  {
    author: { type: Schema.Types.ObjectId, ref: 'UserModel', required: true },
    tuit: { type: String, required: true },
    postedDate: { type: Date, required: true, default: Date.now },
    stats: {
      likes: { type: Number, default: 0 },
      replies: { type: Number, default: 0 },
      dislikes: { type: Number, default: 0 },
      retuits: { type: Number, default: 0 },
    },
    likedBy: [
      { type: Schema.Types.ObjectId, ref: 'UserModel', required: true },
    ],
    dislikedBy: [
      { type: Schema.Types.ObjectId, ref: 'UserModel', required: true },
    ],
  },
  { timestamps: true, collection: 'tuits' }
);

/**
 * Ensure uniqueness of each tuit document based on the author and tuit content. Prevents tuits of duplicate content.
 */
TuitSchema.index(
  {
    author: 1,
    tuit: 1,
  },
  {
    unique: true,
  }
);

/**
 * Check if user/author FK is valid before creating tuit.
 */
TuitSchema.pre('save', async function (next) {
  const existingUser = await UserModel.findById(this.author._id);
  if (existingUser === null) {
    throw new MongooseException('Author is not an existing user.');
  }
});
/**
 * Delete all the likes and bookmarks for this tuit.
 */
TuitSchema.post('deleteOne', async function (next) {
  const tuitId = this.getQuery()._id;
  await LikeModel.deleteMany({ tuit: tuitId });
  await DislikeModel.deleteMany({ tuit: tuitId });
  await BookmarkModel.deleteMany({ tuit: tuitId });
});

formatJSON(TuitSchema);
export default TuitSchema;
