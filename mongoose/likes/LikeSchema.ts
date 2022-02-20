import mongoose, { Schema } from 'mongoose';
import ILike from '../../models/likes/ILike';
import TuitModel from '../tuiters/TuitModel';

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
// Stored procedure that increments the number of likes a tuit has when a like is created.
LikeSchema.post('save', async (doc, next) => {
  console.log('plus triggered');
  const tuitId = doc.tuit;
  await TuitModel.updateOne({ _id: tuitId }, { $inc: { likeCount: +1 } });
});

// Stored procedure that decrements the number of likes a tuit has when a like is deleted.
LikeSchema.post('remove', async (doc, next) => {
  console.log('minus triggered');
  const tuitId = doc.tuit;
  await TuitModel.updateOne({ _id: tuitId }, { $inc: { likeCount: -1 } });
});

LikeSchema.index(
  {
    user: 1,
    tuit: 1,
  },
  { unique: true }
);

export default LikeSchema;
