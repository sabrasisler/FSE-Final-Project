import IFollow from '../../models/follows/IFollow';
import IUser from '../../models/users/IUser';

export default interface IFollowDao {
  userFollowsUser(follower: string, following: string): Promise<IFollow>;
  userUnfollowsUser(follower: string, following: string): Promise<IFollow>;
  findAllUsersThatUserIsFollowing(userId: string): Promise<IUser[]>;
  findAllUsersFollowingUser(userId: string): Promise<IUser[]>;
}
