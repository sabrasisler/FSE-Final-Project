import IUser from '../../models/users/IUser';

export default interface IValidator<T> {
  validate(user: IUser): void;
}
