import mongoose from 'mongoose';
import ITuit from '../../models/tuits/ITuit';

const TuiterSchema = new mongoose.Schema<ITuit>({
  postedBy: { type: String, required: true },
  tuit: { type: String, required: true },
});

export default TuiterSchema;
