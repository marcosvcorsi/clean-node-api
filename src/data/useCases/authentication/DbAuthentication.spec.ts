import { AccountModel } from '../../../domain/models/Account';
import { LoadAccountByEmailRepository } from '../../protocols/LoadAccountByEmailRepository';
import { DbAuthentication } from './DbAuthentication';

const makeLoadAccountByEmailRepository = (): LoadAccountByEmailRepository => {
  class LoadAccountByEmailRepositoryStub
    implements LoadAccountByEmailRepository {
    async load(email: string): Promise<AccountModel> {
      const account: AccountModel = {
        id: 'anyid',
        email,
        name: 'anyname',
        password: 'anypassword',
      };

      return Promise.resolve(account);
    }
  }

  return new LoadAccountByEmailRepositoryStub();
};

const makeSut = (): any => {
  const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepository();
  const sut = new DbAuthentication(loadAccountByEmailRepositoryStub);

  return {
    sut,
    loadAccountByEmailRepositoryStub,
  };
};

describe('DbAuthentication UseCase', () => {
  it('should call LoadAccountByEmailRepository with correct email', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut();

    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'load');

    await sut.auth({
      email: 'anyemail@mail.com',
      password: 'anypassword',
    });

    expect(loadSpy).toHaveBeenCalledWith('anyemail@mail.com');
  });
});
