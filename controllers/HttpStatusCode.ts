/**
 * @readonly
 * @enum {number}
 * Represents the http status codes used by the application to send responses to the client.
 */
export enum HttpStatusCode {
  notFound = 404,
  internalError = 500,
  ok = 200,
  badRequest = 400,
  conflict = 409,
}
