import {
  Authentication,
  AuthenticationModel,
} from '../../../domain/useCases/Authentication';
import { LoadAccountByEmailRepository } from '../../protocols/db/LoadAccountByEmailRepository';
import { HashComparer } from '../../protocols/cryptography/HashComparer';

export class DbAuthentication implements Authentication {
  private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository;

  private readonly hashComparer: HashComparer;

  constructor(
    loadAccountByEmailRepository: LoadAccountByEmailRepository,
    hashComparer: HashComparer,
  ) {
    this.loadAccountByEmailRepository = loadAccountByEmailRepository;
    this.hashComparer = hashComparer;
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
    }

    return null;
  }
}
