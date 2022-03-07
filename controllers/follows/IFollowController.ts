import HttpRequest from '../shared/HttpRequest';
import HttpResponse from '../shared/HttpResponse';
import IBaseController from '../shared/IBaseController';

/**
 * Common controller request, response operations for the follow resource.
 */
export default interface IFollowController extends IBaseController {
  createFollow(req: HttpRequest): Promise<HttpResponse>;
  deleteFollow(req: HttpRequest): Promise<HttpResponse>;
  acceptFollow(req: HttpRequest): Promise<HttpResponse>;
  findAllUsersThatUserIsFollowing(req: HttpRequest): Promise<HttpResponse>;
  findAllUsersFollowingUser(req: HttpRequest): Promise<HttpResponse>;
  findAllPendingFollows(req: HttpRequest): Promise<HttpResponse>;
}
