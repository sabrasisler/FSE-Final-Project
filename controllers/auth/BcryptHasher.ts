import IHasher from './IHasher';
import bcrypt from 'bcrypt';

export default class BcryptHasher implements IHasher {
  private readonly saltRounds: number;
  public constructor(saltRounds: number) {
    this.saltRounds = saltRounds;
  }
  compare = async (
    plainPhrase: string,
    encryptedPhrase: string
  ): Promise<boolean> => {
    return await bcrypt.compare(plainPhrase, encryptedPhrase);
  };
  hash = async (phrase: string): Promise<string> => {
    return await bcrypt.hash(phrase, this.saltRounds);
  };
}
