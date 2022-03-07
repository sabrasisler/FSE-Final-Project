import IFollow from '../../models/follows/IFollow';
import IUser from '../../models/users/IUser';

export default interface IFollowDao {
  createFollow(follower: string, followee: string): Promise<IFollow>;
  deleteFollow(follower: string, followee: string): Promise<IFollow>;
  findAllPendingFollows(userId: string): Promise<IFollow[]>;
  acceptFollow(followerId: string, followeeId: string): Promise<IFollow>;
  findAllUsersThatUserIsFollowing(userId: string): Promise<IUser[]>;
  findAllUsersFollowingUser(userId: string): Promise<IUser[]>;
}
