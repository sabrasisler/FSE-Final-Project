/**
 * Interface of a local common application error that contains info about the error being operational (expected) and the status code of the error.
 */
export default interface IError extends Error {
  isOperational: boolean;
  code: number;
}
