import CustomError from './CustomError';
/**
 * Handle all the errors.
 * @param err
 * @param fallbackMessage
 * @returns good stuff
 */
const handleError = (err: unknown, fallbackMessage: string): CustomError => {
  if (err instanceof Error) {
    return new CustomError(500, err.message, true);
  } else {
    return new CustomError(500, fallbackMessage, true);
  }
};

export default handleError;
