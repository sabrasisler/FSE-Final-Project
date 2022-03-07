import IFollow from '../../models/follows/IFollow';

export default interface IFollowService {
  createFollow(followerId: string, followeeId: string): Promise<IFollow>;
  acceptFollow(followerId: string, followeeId: string): Promise<IFollow>;
  deleteFollow(followerId: string, followeeId: string): Promise<IFollow>;
}
