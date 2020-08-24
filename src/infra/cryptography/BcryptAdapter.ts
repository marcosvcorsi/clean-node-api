import bcrypt from 'bcrypt';
import { Hasher } from '../../data/protocols/cryptography/Hasher';

export class BcryptAdapter implements Hasher {
  private readonly salt: number;

  constructor(salt: number) {
    this.salt = salt;
  }

  async hash(value: string): Promise<string> {
    return bcrypt.hash(value, this.salt);
  }
}
