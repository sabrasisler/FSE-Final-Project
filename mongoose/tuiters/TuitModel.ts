import mongoose from 'mongoose';
import ITuit from '../../models/tuits/ITuit';
import TuitSchema from './TuitSchema';

export default mongoose.model<ITuit>('TuitModel', TuitSchema);
