export enum FollowDaoErrors {
  USER_OR_TUIT_NOT_FOUND = 'Follow DAO error: No user found',
  NULL_FOLLOW_NEW = 'Database returned null for new follow.',
  NO_FOLLOW_FOUND_TO_DELETE = 'No Follow document found to delete.',
  DB_ERROR_USER_FOLLOWS_USER = 'Database error in creating follow for user follows user.',
  DB_ERROR_USER_UNFOLLOWS_USER = 'Database error in deleting follow.',
  DB_ERROR_FINDING_FOLLOWERS_OF_USER = 'Database errors finding all followers of a user',
  DB_ERROR_FINDING_ALL_USERS_FOLLOWING_USER = 'Database errors finding all users following a user.',
  DB_ERROR_ACCEPT_FOLLOW = 'Database error in updating accept follow request.',
  NO_FOLLOW_FOUND = 'No matching follow(s) was found.',
  DB_ERROR_PENDING_FOLLOWS = 'Database error finding all pending follows for the specified user.',
}
