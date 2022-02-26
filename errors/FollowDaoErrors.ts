export enum FollowDaoErrors {
  USER_OR_TUIT_NOT_FOUND = 'Follow DAO error: No user found',
  NO_FOLLOW_FOUND_TO_DELETE = 'No Follow document found to delete.',
  DB_ERROR_USER_FOLLOWS_USER = 'Database error in creating follow for user follows user.',
  DB_ERROR_USER_UNFOLLOWS_USER = 'Database error in deleting follow.',
  DB_ERROR_FINDING_FOLLOWERS_OF_USER = 'Database errors finding all followers of a user',
  DB_ERROR_FINDING_ALL_USERS_FOLLOWING_USER = 'Database errors finding all users following a user.',
}
