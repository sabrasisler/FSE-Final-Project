export default interface IAuthenticationStrategy {
  authenticate(): void;
  redirect(): void;
}
