import mongoose from 'mongoose';
import ILike from '../../models/likes/ILike';
import DislikeSchema from './DislikeSchema';

export default mongoose.model<ILike>('DislikeModel', DislikeSchema);
