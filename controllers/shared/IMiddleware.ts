import { Methods } from './Methods';

interface MiddlewareFunc {
  middleware: Function;
}

interface Endpoint {
  path: { [key: string]: Methods };
}

const localMiddleware: Array<Endpoint> = [
  {
    path: { '/users': Methods.GET },
  },
];
/**
 *
 * 'users': {
 *
 * 'GET': ()=>
 * }
 *
 * endpoint: {
 *
 * method: Function
 * }
 */
