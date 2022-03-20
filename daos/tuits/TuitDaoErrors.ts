/**
 * @readonly
 * @enum {string}
 * Error messages for the tuit DAO used when throwing exceptions.
 */
export enum TuitDaoErrors {
  NO_USER_FOUND = 'Cannot create tuit: A user by this id was not found.',
  DB_ERROR_CREATING_TUIT = 'Database error creating tuit.',
  DB_ERROR_EXISTS = 'Database error checking if tuit exists.',
  TUIT_NOT_FOUND = 'No matching tuit(s) found',
  DB_ERROR_FINDING_TUITS = 'DB error finding tuit(s)',
  DB_ERROR_UPDATING_TUIT = 'DB updating tuit.',
  DB_ERROR_DELETING_TUIT = 'DB deleting tuit.',
}
