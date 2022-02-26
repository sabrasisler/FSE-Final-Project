import mongoose from 'mongoose';
import ITuit from '../../models/tuits/ITuit';
import TuitSchema from './TuitSchema';

/**
 * Mongoose database model for the tuit resource that uses a {@link TuitSchema}.
 * @module TuitModel
 */
export default mongoose.model<ITuit>('TuitModel', TuitSchema);
