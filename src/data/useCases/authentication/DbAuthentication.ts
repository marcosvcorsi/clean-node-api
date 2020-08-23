import {
  Authentication,
  AuthenticationModel,
} from '../../../domain/useCases/Authentication';
import { LoadAccountByEmailRepository } from '../../protocols/db/LoadAccountByEmailRepository';

export class DbAuthentication implements Authentication {
  private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository;

  constructor(loadAccountByEmailRepository: LoadAccountByEmailRepository) {
    this.loadAccountByEmailRepository = loadAccountByEmailRepository;
  }

  async auth(authentication: AuthenticationModel): Promise<string> {
    await this.loadAccountByEmailRepository.load(authentication.email);

    return null;
  }
}
