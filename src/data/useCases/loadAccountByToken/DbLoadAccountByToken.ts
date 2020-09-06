import { LoadAccountByToken } from '../../../domain/useCases/LoadAccountByToken';
import { AccountModel } from '../../../domain/models/Account';
import { Decrypter } from '../../protocols/cryptography/Decrypter';

export class DbLoadAccountByToken implements LoadAccountByToken {
  constructor(private readonly decrypter: Decrypter) {}

  async load(token: string, role?: string): Promise<AccountModel> {
    console.log(token, role);

    await this.decrypter.decrypt(token);

    return null;
  }
}
