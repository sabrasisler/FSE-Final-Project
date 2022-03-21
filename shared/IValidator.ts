export default interface IValidator<T> {
  validate(user: T): void;
}
