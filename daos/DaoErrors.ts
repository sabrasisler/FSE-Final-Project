export enum DaoErrors {
  CANNOT_CREATE_USER = 'Databse error in creating user.',
  CANNOT_CONNECT_DB = 'Unable to connect to database.',
  CANNOT_DISCONNECT_DB = 'Error diconnecting from database',
  CANNOT_SAVE_TO_DB = 'Unable to save to database.',
  ERROR_FINDING_USER = 'Database error finding user.',
  ERROR_FINDING_ALL_USERS = 'Database error in retrieving all users.',
  USER_ALREADY_EXISTS = 'Cannot create user because it already exists in the database.',
}
