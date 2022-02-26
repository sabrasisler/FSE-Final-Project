import mongoose from 'mongoose';
import IUser from '../../models/users/IUser';
import UserSchema from './UserSchema';

/**
 * Mongoose database model for the user resource. Uses a {@link UserSchema}.
 * @module UserModel
 */
export default mongoose.model<IUser>('UserModel', UserSchema);
