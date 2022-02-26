import mongoose from 'mongoose';
import ILike from '../../models/likes/ILike';
import LikeSchema from './LikeSchema';

/**
 * A Mongoose model for the like resource that takes a {@link LikeSchema}.
 * @module LikeModel
 */
export default mongoose.model<ILike>('LikeModel', LikeSchema);
