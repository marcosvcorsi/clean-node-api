import {
  LoadAccountByTokenRepository,
  Decrypter,
  AccountModel,
  LoadAccountByToken,
} from './DbLoadAccountByTokenProtocols';

export class DbLoadAccountByToken implements LoadAccountByToken {
  constructor(
    private readonly decrypter: Decrypter,
    private readonly loadAccountByTokenRepository: LoadAccountByTokenRepository,
  ) {}

  async load(token: string, role?: string): Promise<AccountModel> {
    let accessToken: string;

    try {
      accessToken = await this.decrypter.decrypt(token);
    } catch (error) {
      return null;
    }

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
