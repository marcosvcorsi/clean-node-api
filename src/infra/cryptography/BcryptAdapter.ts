import bcrypt from 'bcrypt';
import { Hasher } from '../../data/protocols/cryptography/Hasher';
import { HashComparer } from '../../data/protocols/cryptography/HashComparer';

export class BcryptAdapter implements Hasher, HashComparer {
  private readonly salt: number;

  constructor(salt: number) {
    this.salt = salt;
  }

  async hash(value: string): Promise<string> {
    return bcrypt.hash(value, this.salt);
  }

  async compare(value: string, hash: string): Promise<boolean> {
    await bcrypt.compare(value, hash);

    return Promise.resolve(!!value && !!hash);
  }
}
