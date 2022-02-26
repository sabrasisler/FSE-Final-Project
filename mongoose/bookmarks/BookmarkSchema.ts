import mongoose, { Schema } from 'mongoose';
import IBookmark from '../../models/bookmarks/IBookmark';

/**
 * Mongoose schema for the bookmarks resource that takes an {@link IBookmark} interface. The schema contains a user and tuit foreign key references. All fields are required, and created/updated time stamps are added.
 * @constructor BookmarkSchema
 * @param {Schema.Types.ObjectId} user the user foreign key
 * @param {Schema.Types.ObjectId} tuit the tuit foreign key
 * @module BookmarkSchema
 *
 */
const BookmarkSchema = new mongoose.Schema<IBookmark>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'UserModel', required: true },
    tuit: { type: Schema.Types.ObjectId, ref: 'TuitModel', required: true },
  },
  {
    timestamps: true,
    collection: 'bookmarks',
  }
);

/**
 * Prevents bookmark duplicates.
 */
BookmarkSchema.index(
  {
    user: 1,
    tuit: 1,
  },
  {
    unique: true,
  }
);

export default BookmarkSchema;
