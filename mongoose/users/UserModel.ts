import mongoose from 'mongoose';
import IUser from '../../models/users/IUser';
import UserSchema from './UserSchema';

export default mongoose.model<IUser>('UserModel', UserSchema);
