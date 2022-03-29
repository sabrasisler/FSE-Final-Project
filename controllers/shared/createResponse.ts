import HttpResponse from './HttpResponse';
import { StatusCode } from './HttpStatusCode';

export const okResponse = <T>(data: T): HttpResponse => ({
  code: StatusCode.ok,
  body: data,
});

export const unauthorizedResponse = <T>(data: T): HttpResponse => ({
  code: StatusCode.unauthorized,
  body: data,
});
