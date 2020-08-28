import jwt from 'jsonwebtoken';
import { Encrypter } from '../../../data/protocols/cryptography/Encrypter';

export class JwtAdapter implements Encrypter {
  constructor(private readonly secret: string = 'secret') {}

  async encrypt(value: string): Promise<string> {
    const accessToken = await jwt.sign({ id: value }, this.secret);

    return accessToken;
  }
}
