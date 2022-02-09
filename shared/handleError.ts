import CustomError from './CustomError';

const handleError = (err: unknown, fallbackMessage: string): CustomError => {
  if (err instanceof Error) {
    throw new CustomError(500, err.message, true);
  } else {
    throw new CustomError(500, fallbackMessage, true);
  }
};

export default handleError;
