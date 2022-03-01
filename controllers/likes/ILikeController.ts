import HttpRequest from '../HttpRequest';
import HttpResponse from '../HttpResponse';
import IBaseController from '../IBaseController';
import IGenericController from '../IGenericController';

/**
 *
 * Interface representing a CRUD controller for the likes resource api. Defines the controller operations of a like, including user likes/dislikes tuit, finding all users that liked a tuit, and finding all tuits liked by a user.
 */
export default interface ILikeController extends IBaseController {
  userLikesTuit(req: HttpRequest): Promise<HttpResponse>;

  userUnlikesTuit(req: HttpRequest): Promise<HttpResponse>;

  findAllUsersByTuitLike(req: HttpRequest): Promise<HttpResponse>;

  /**
   * Processes the request of getting all tuits liked by a user.
   */
  findAllTuitsLikedByUser(req: HttpRequest): Promise<HttpResponse>;
}
