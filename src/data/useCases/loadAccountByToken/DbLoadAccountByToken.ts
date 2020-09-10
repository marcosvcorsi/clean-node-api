import { LoadAccountByToken } from '@/domain/useCases/LoadAccountByToken';
import { AccountModel } from '@/domain/models/Account';
import { Decrypter } from '../../protocols/cryptography/Decrypter';
import { LoadAccountByTokenRepository } from '../../protocols/db/account/LoadAccountByTokenRepository';

export class DbLoadAccountByToken implements LoadAccountByToken {
  constructor(
    private readonly decrypter: Decrypter,
    private readonly loadAccountByTokenRepository: LoadAccountByTokenRepository,
  ) {}

  async load(token: string, role?: string): Promise<AccountModel> {
    const accessToken = await this.decrypter.decrypt(token);

    if (accessToken) {
      const account = await this.loadAccountByTokenRepository.loadByToken(
        token,
        role,
      );

      return account;
    }

    return null;
  }
}
