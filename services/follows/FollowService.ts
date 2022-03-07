// import IFollowDao from '../../daos/follows/IFollowDao';
// import IDao from '../../daos/IDao';
// import IFollow from '../../models/follows/IFollow';
// import IUser from '../../models/users/IUser';
// import IService from '../shared/IFollowService';

// export default class FollowService implements IService {
//   private readonly userDao: IDao<IUser>;
//   private readonly followDao: IFollowDao;
//   constructor(userDao: IDao<IUser>, followDao: IFollowDao) {
//     this.userDao = userDao;
//     this.followDao = followDao;
//     Object.freeze(this);
//   }
//   updateFollowerCount = async (
//     userId: string,
//     increment: boolean
//   ): Promise<void> => {
//     const user: IUser = await this.userDao.findById(userId);
//     let count: number;
//     if (increment) {
//       count = user.followerCount++;
//     } else {
//       count = user.followerCount--;
//     }
//     const updatedUser: IUser = {
//       ...user,
//       followerCount: count,
//     };
//     await this.userDao.update(userId, updatedUser);
//   };
//   updateFolloweeCount = async (
//     userId: string,
//     increment: boolean
//   ): Promise<void> => {
//     const user: IUser = await this.userDao.findById(userId);
//     let count: number;
//     if (increment) {
//       count = user.followeeCount++;
//     } else {
//       count = user.followeeCount--;
//     }
//     const updatedUser: IUser = {
//       ...user,
//       followeeCount: count,
//     };
//     await this.userDao.update(userId, updatedUser);
//   };
//   deleteFollow = async (
//     followerId: string,
//     followeeId: string
//   ): Promise<IFollow> => {
//     await this.updateFollowerCount(followeeId, false);
//     await this.updateFolloweeCount(followerId, false);
//     const deletedFollow = await this.followDao.deleteFollow(
//       followerId,
//       followeeId
//     );
//     return deletedFollow;
//   };
//   createFollow = async (
//     followerId: string,
//     followeeId: string
//   ): Promise<IFollow> => {
//     await this.updateFolloweeCount(followerId, true);
//     await this.updateFollowerCount(followeeId, true);
//     const newFollow = await this.followDao.createFollow(followerId, followeeId);
//     return newFollow;
//   };
//   acceptFollow = async (
//     followerId: string,
//     followeeId: string
//   ): Promise<IFollow> => {
//     await this.updateFollowerCount(followeeId, true);
//     await this.updateFolloweeCount(followerId, true);
//     const acceptedFollow: IFollow = await this.followDao.acceptFollow(
//       followerId,
//       followeeId
//     );
//     return acceptedFollow;
//   };
// }
