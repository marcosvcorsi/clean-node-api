import jwt from 'jsonwebtoken';
import { Encrypter } from '../../../data/protocols/cryptography/Encrypter';
import { Decrypter } from '../../../data/protocols/cryptography/Decrypter';

export class JwtAdapter implements Encrypter, Decrypter {
  constructor(private readonly secret: string = 'secret') {}

  async encrypt(value: string): Promise<string> {
    const accessToken = await jwt.sign({ id: value }, this.secret);

    return accessToken;
  }

  async decrypt(value: string): Promise<string> {
    await jwt.verify(value, this.secret);

    return null;
  }
}
