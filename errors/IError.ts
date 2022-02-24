export default interface IError extends Error {
  isOperational: boolean;
  status: number;
}
