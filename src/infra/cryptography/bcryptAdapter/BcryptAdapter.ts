import bcrypt from 'bcrypt';
import { Hasher } from '../../../data/protocols/cryptography/Hasher';
import { HashComparer } from '../../../data/protocols/cryptography/HashComparer';

export class BcryptAdapter implements Hasher, HashComparer {
  constructor(private readonly salt: number) {}

  async hash(value: string): Promise<string> {
    return bcrypt.hash(value, this.salt);
  }

  async compare(value: string, hash: string): Promise<boolean> {
    const match = await bcrypt.compare(value, hash);

    return match;
  }
}
