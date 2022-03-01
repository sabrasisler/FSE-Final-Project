import mongoose, { Schema } from 'mongoose';
import { HttpStatusCode } from '../../controllers/HttpStatusCode';
import ILike from '../../models/likes/ILike';
import TuitModel from '../tuits/TuitModel';
import UserModel from '../users/UserModel';
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

export default LikeSchema;
