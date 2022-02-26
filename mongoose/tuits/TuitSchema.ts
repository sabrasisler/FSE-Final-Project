import mongoose, { Schema } from 'mongoose';
import ITuit from '../../models/tuits/ITuit';
import UserSchema from '../users/UserSchema';

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

export default TuitSchema;
