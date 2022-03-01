import IFollow from '../../models/follows/IFollow';
import IUser from '../../models/users/IUser';

export default interface IFollowDao {
  userFollowsUser(follower: string, followee: string): Promise<IFollow>;
  userUnfollowsUser(follower: string, followee: string): Promise<IFollow>;
  findAllPendingFollows(userId: string): Promise<IFollow[]>;
  acceptFollow(userId: string, followId: string): Promise<IFollow>;
  findAllUsersThatUserIsFollowing(userId: string): Promise<IUser[]>;
  findAllUsersFollowingUser(userId: string): Promise<IUser[]>;
}
