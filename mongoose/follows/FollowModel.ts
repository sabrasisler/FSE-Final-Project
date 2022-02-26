import mongoose from 'mongoose';
import IFollow from '../../models/follows/IFollow';
import FollowSchema from './FollowSchema';

export default mongoose.model<IFollow>('FollowModel', FollowSchema);
