import {
  Authentication,
  LoadAccountByEmailRepository,
  AuthenticationModel,
  HashComparer,
  Encrypter,
  UpdateAccessTokenRepository,
} from './DbAuthenticationProtocols';

export class DbAuthentication implements Authentication {
  private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository;

  private readonly hashComparer: HashComparer;

  private readonly encrypter: Encrypter;

  private readonly updateAccessTokenRepository: UpdateAccessTokenRepository;

  constructor(
    loadAccountByEmailRepository: LoadAccountByEmailRepository,
    hashComparer: HashComparer,
    encrypter: Encrypter,
    updateAccessTokenRepository: UpdateAccessTokenRepository,
  ) {
    this.loadAccountByEmailRepository = loadAccountByEmailRepository;
    this.hashComparer = hashComparer;
    this.encrypter = encrypter;
    this.updateAccessTokenRepository = updateAccessTokenRepository;
  }

  async auth(authentication: AuthenticationModel): Promise<string> {
    const account = await this.loadAccountByEmailRepository.load(
      authentication.email,
    );

    if (!account) {
      return null;
    }

    const match = await this.hashComparer.compare(
      authentication.password,
      account.password,
    );

    if (!match) {
      return null;
    }

    const accessToken = await this.encrypter.encrypt(account.id);

    await this.updateAccessTokenRepository.updateAccessToken(
      account.id,
      accessToken,
    );

    return accessToken;
  }
}
