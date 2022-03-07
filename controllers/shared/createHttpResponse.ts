import HttpResponse from './HttpResponse';
import { HttpStatusCode } from './HttpStatusCode';

export const createOkResponse = <T>(data: T): HttpResponse => ({
  code: HttpStatusCode.ok,
  body: data,
});
