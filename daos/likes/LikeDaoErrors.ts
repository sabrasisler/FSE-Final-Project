/**
 * @readonly
 * @enum {string}
 * Error messages for the like DAO used when throwing exceptions.
 */
export enum LikeDaoErrors {
  LIKE_NOT_FOUND = 'Like Not found in database.',
  DELETED_LIKE_NOT_FOUND = 'Deleted like returned as null from database.',
  DB_ERROR_LIKE_TUIT = 'Database error in creating tuit like.',
  DB_ERROR_UNLIKE_TUIT = 'Database error in deleting tuit.',
  NO_USERS_FOUND_FOR_LIKE = 'No users found for the requested likes.',
  DB_ERROR_USERS_BY_LIKE = 'Database error in retrieving users for this like.',
  NO_TUITS_FOUND_FOR_LIKE = 'No tuits found for this like',
  DB_ERROR_TUITS_BY_LIKE = 'Database error in retrieving tuits by like',
  TUIT_NOT_FOUND = 'Tuit not found after updating likes.',
  STATS_NOT_UPDATED = 'Error updating tuit stats.',
}
