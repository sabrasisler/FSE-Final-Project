export enum FollowServiceErrors {
  USER_NOT_FOUND = 'Service error in finding user.',
  UNEXPECTED_ERROR_FINDING_USER = 'Unexpected service error finding user.',
  UNEXPECTED_ERROR_UPDATING_USER = 'Unexpected service updating user after follow operation.',
  UNEXPECTED_ERROR_CREATING_FOLLOW = 'Unexpected service error processing user follows user.',
}
