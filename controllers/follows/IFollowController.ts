import HttpRequest from '../shared/HttpRequest';
import HttpResponse from '../shared/HttpResponse';

/**
 * Common controller request, response operations for the follow resource.
 */
export default interface IFollowController {
  createFollow(req: HttpRequest): Promise<HttpResponse>;
  deleteFollow(req: HttpRequest): Promise<HttpResponse>;
  acceptFollow(req: HttpRequest): Promise<HttpResponse>;
  findAllFollowees(req: HttpRequest): Promise<HttpResponse>;
  findAllFollowers(req: HttpRequest): Promise<HttpResponse>;
  findAllPendingFollows(req: HttpRequest): Promise<HttpResponse>;
}
