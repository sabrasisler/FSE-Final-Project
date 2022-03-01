import mongoose from 'mongoose';
import IFollow from '../../models/follows/IFollow';
import FollowSchema from './FollowSchema';

/**
 * A Mongoose model for the follows resource that takes a {@link FollowSchema}.
 * @module FollowModel
 */
export default mongoose.model<IFollow>('FollowModel', FollowSchema);
