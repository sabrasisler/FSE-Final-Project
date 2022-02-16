import mongoose, { Schema } from 'mongoose';
import ITuit from '../../models/tuits/ITuit';

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

export default TuitSchema;
