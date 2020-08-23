import { AccountModel } from '../../../domain/models/Account';
import { LoadAccountByEmailRepository } from '../../protocols/db/LoadAccountByEmailRepository';
import { DbAuthentication } from './DbAuthentication';
import { AuthenticationModel } from '../../../domain/useCases/Authentication';
import { HashComparer } from '../../protocols/cryptography/HashComparer';

interface SutType {
  sut: DbAuthentication;
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository;
  hashComparerStub: HashComparer;
}

const makeHashComparer = (): HashComparer => {
  class HashComparerStub implements HashComparer {
    async compare(value: string, hash: string): Promise<boolean> {
      return Promise.resolve(!!value && !!hash);
    }
  }

  return new HashComparerStub();
};

const makeLoadAccountByEmailRepository = (): LoadAccountByEmailRepository => {
  class LoadAccountByEmailRepositoryStub
    implements LoadAccountByEmailRepository {
    async load(email: string): Promise<AccountModel> {
      const account: AccountModel = {
        id: 'anyid',
        email,
        name: 'anyname',
        password: 'hashed_password',
      };

      return Promise.resolve(account);
    }
  }

  return new LoadAccountByEmailRepositoryStub();
};

const makeSut = (): SutType => {
  const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepository();
  const hashComparerStub = makeHashComparer();
  const sut = new DbAuthentication(
    loadAccountByEmailRepositoryStub,
    hashComparerStub,
  );

  return {
    sut,
    loadAccountByEmailRepositoryStub,
    hashComparerStub,
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

  it('should return null if LoadAccountByEmailRepository returns null', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut();

    jest
      .spyOn(loadAccountByEmailRepositoryStub, 'load')
      .mockReturnValueOnce(null);

    const accessToken = await sut.auth(makeFakeAuth());

    expect(accessToken).toBeNull();
  });

  it('should call HashComparer with correct values', async () => {
    const { sut, hashComparerStub } = makeSut();

    const hashCompareSpy = jest.spyOn(hashComparerStub, 'compare');

    await sut.auth(makeFakeAuth());

    expect(hashCompareSpy).toHaveBeenCalledWith(
      'anypassword',
      'hashed_password',
    );
  });

  it('should throw if HashComparer throws', async () => {
    const { sut, hashComparerStub } = makeSut();

    jest
      .spyOn(hashComparerStub, 'compare')
      .mockReturnValueOnce(Promise.reject(new Error()));

    await expect(sut.auth(makeFakeAuth())).rejects.toThrow();
  });
});
