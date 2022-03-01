import HttpRequest from '../HttpRequest';
import HttpResponse from '../HttpResponse';
import IBaseController from '../IBaseController';

/**
 * Common controller request, response operations for the follow resource.
 */
export default interface IFollowController extends IBaseController {
  userFollowsUser(req: HttpRequest): Promise<HttpResponse>;
  userUnfollowsUser(req: HttpRequest): Promise<HttpResponse>;
  acceptFollow(req: HttpRequest): Promise<HttpResponse>;
  findAllUsersThatUserIsFollowing(req: HttpRequest): Promise<HttpResponse>;
  findAllUsersFollowingUser(req: HttpRequest): Promise<HttpResponse>;
  findAllPendingFollows(req: HttpRequest): Promise<HttpResponse>;
}
