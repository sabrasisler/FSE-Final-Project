import HttpResponse from './HttpResponse';
import { StatusCode } from './HttpStatusCode';

export const createOkResponse = <T>(data: T): HttpResponse => ({
  code: StatusCode.ok,
  body: data,
});

export const createUnauthorizedResponse = <T>(data: T): HttpResponse => ({
  code: StatusCode.unauthorized,
  body: data,
});
