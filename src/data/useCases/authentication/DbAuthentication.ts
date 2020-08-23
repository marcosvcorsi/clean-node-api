import {
  Authentication,
  AuthenticationModel,
} from '../../../domain/useCases/Authentication';
import { LoadAccountByEmailRepository } from '../../protocols/db/LoadAccountByEmailRepository';
import { HashComparer } from '../../protocols/cryptography/HashComparer';
import { TokenGenerator } from '../../protocols/cryptography/TokenGenerator';

export class DbAuthentication implements Authentication {
  private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository;

  private readonly hashComparer: HashComparer;

  private readonly tokenGenerator: TokenGenerator;

  constructor(
    loadAccountByEmailRepository: LoadAccountByEmailRepository,
    hashComparer: HashComparer,
    tokenGenerator: TokenGenerator,
  ) {
    this.loadAccountByEmailRepository = loadAccountByEmailRepository;
    this.hashComparer = hashComparer;
    this.tokenGenerator = tokenGenerator;
  }

  async auth(authentication: AuthenticationModel): Promise<string> {
    const account = await this.loadAccountByEmailRepository.load(
      authentication.email,
    );

    if (account) {
      await this.hashComparer.compare(
        authentication.password,
        account.password,
      );

      await this.tokenGenerator.generate(account.id);
    }

    return null;
  }
}
