import { AccountModel } from '../../../domain/models/Account';
import { LoadAccountByEmailRepository } from '../../protocols/LoadAccountByEmailRepository';
import { DbAuthentication } from './DbAuthentication';
import { AuthenticationModel } from '../../../domain/useCases/Authentication';

interface SutType {
  sut: DbAuthentication;
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository;
}

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

const makeSut = (): SutType => {
  const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepository();
  const sut = new DbAuthentication(loadAccountByEmailRepositoryStub);

  return {
    sut,
    loadAccountByEmailRepositoryStub,
  };
};

const makeFakeAuth = (): AuthenticationModel => ({
  email: 'anyemail@mail.com',
  password: 'anypassword',
});

describe('DbAuthentication UseCase', () => {
  it('should call LoadAccountByEmailRepository with correct email', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut();

    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'load');

    await sut.auth(makeFakeAuth());

    expect(loadSpy).toHaveBeenCalledWith('anyemail@mail.com');
  });

  it('should throw if LoadAccountByEmailRepository throws', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut();

    jest
      .spyOn(loadAccountByEmailRepositoryStub, 'load')
      .mockReturnValueOnce(Promise.reject(new Error()));

    await expect(sut.auth(makeFakeAuth())).rejects.toThrow();
  });
});
