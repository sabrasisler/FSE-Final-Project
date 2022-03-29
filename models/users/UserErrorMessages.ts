export enum UserErrorMessages {
  INVALID_NAME = 'Name must be greater than 2 characters and less than 50.',
  INVALID_EMAIL = 'Invalid email.',
  INVALID_PASSWORD = 'Invalid password. Password must be at least: 8 characters long; one uppercase letter; one lowercase letter; one digit; one special character.',
  NO_PASSWORD = 'No password provided',
  NO_USERNAME_EMAIL = 'No username or email provided',
  INVALID_DATE = 'Invalid date',
  INVALID_BIO = 'Invalid bio. Must be less than 150 characters.',
  INVALID_DOB = 'Invalid date of birth. Valid format: YYYY-MM-DD',
  INVALID_USERNAME = 'Invalid username.',
  INVALID_ACCOUNT_TYPE = 'Invalid account type.',
  FOLLOWERS_FOLLOWEE = 'Follower Followee count cannot be empty.',
}
