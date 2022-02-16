import mongoose from 'mongoose';
import ILike from '../../models/likes/ILike';
import LikeSchema from './LikeSchema';

export default mongoose.model<ILike>('LikeModel', LikeSchema);
