import {
  Authentication,
  AuthenticationModel,
} from '../../../domain/useCases/Authentication';
import { LoadAccountByEmailRepository } from '../../protocols/db/LoadAccountByEmailRepository';
import { HashComparer } from '../../protocols/cryptography/HashComparer';
import { TokenGenerator } from '../../protocols/cryptography/TokenGenerator';
import { UpdateAccessTokenRepository } from '../../protocols/db/UpdateAccessTokenRepository';

export class DbAuthentication implements Authentication {
  private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository;

  private readonly hashComparer: HashComparer;

  private readonly tokenGenerator: TokenGenerator;

  private readonly updateAccessTokenRepository: UpdateAccessTokenRepository;

  constructor(
    loadAccountByEmailRepository: LoadAccountByEmailRepository,
    hashComparer: HashComparer,
    tokenGenerator: TokenGenerator,
    updateAccessTokenRepository: UpdateAccessTokenRepository,
  ) {
    this.loadAccountByEmailRepository = loadAccountByEmailRepository;
    this.hashComparer = hashComparer;
    this.tokenGenerator = tokenGenerator;
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

    const accessToken = await this.tokenGenerator.generate(account.id);

    await this.updateAccessTokenRepository.update(account.id, accessToken);

    return accessToken;
  }
}
