import HttpResponse from '../shared/HttpResponse';

export default interface IAuthController {
  login(req: HttpResponse): Promise<HttpResponse>;
  register(req: HttpResponse): Promise<HttpResponse>;
  logout(req: HttpResponse): Promise<HttpResponse>;
  profile(req: HttpResponse): Promise<HttpResponse>;
  fail(req: HttpResponse): Promise<HttpResponse>;
}
