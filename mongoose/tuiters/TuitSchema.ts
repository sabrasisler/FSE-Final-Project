import mongoose, { Schema } from 'mongoose';
import ITuit from '../../models/tuits/ITuit';
import UserSchema from '../users/UserSchema';

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
