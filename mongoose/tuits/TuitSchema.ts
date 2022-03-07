import mongoose, { Schema } from 'mongoose';
import MongooseException from '../../errors/MongooseException';
import ITuit from '../../models/tuits/ITuit';
import BookmarkModel from '../bookmarks/BookmarkModel';
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
    likeCount: { type: Number, default: 0 },
    replyCount: { type: Number, default: 0 },
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
TuitSchema.pre('save', function (next) {
  const existingUser = UserModel.findById(this.author);
  if (existingUser === null) {
    throw new MongooseException('Author is not an existing user.');
  }
});
/**
 * Delete all the likes and bookmarks for this tuit.
 */
TuitSchema.post('remove', async function (next) {
  await LikeModel.deleteMany({ tuit: this._id });
  await BookmarkModel.deleteMany({ tuit: this._id });
});

formatJSON(UserSchema);
export default TuitSchema;
