import { DbAuthentication } from './DbAuthentication';
import {
  AccountModel,
  LoadAccountByEmailRepository,
  AuthenticationModel,
  HashComparer,
  TokenGenerator,
  UpdateAccessTokenRepository,
} from './DbAuthenticationProtocols';

interface SutType {
  sut: DbAuthentication;
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository;
  hashComparerStub: HashComparer;
  tokenGeneratorStub: TokenGenerator;
  updateAccessTokenRepositoryStub: UpdateAccessTokenRepository;
}

const makeUpdateAccessTokenRepository = (): UpdateAccessTokenRepository => {
  class UpdateAccessTokenRepositoryStub implements UpdateAccessTokenRepository {
    async update(id: string, token: string): Promise<void> {
      if (id && token) {
        return Promise.resolve();
      }

      return Promise.reject();
    }
  }

  return new UpdateAccessTokenRepositoryStub();
};

const makeTokenGenerator = (): TokenGenerator => {
  class TokenGeneratorStub implements TokenGenerator {
    async generate(id: string): Promise<string> {
      return Promise.resolve(`${id}_token`);
    }
  }

  return new TokenGeneratorStub();
};

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
  const tokenGeneratorStub = makeTokenGenerator();
  const updateAccessTokenRepositoryStub = makeUpdateAccessTokenRepository();

  const sut = new DbAuthentication(
    loadAccountByEmailRepositoryStub,
    hashComparerStub,
    tokenGeneratorStub,
    updateAccessTokenRepositoryStub,
  );

  return {
    sut,
    loadAccountByEmailRepositoryStub,
    hashComparerStub,
    tokenGeneratorStub,
    updateAccessTokenRepositoryStub,
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

  it('should return null if HashCompare returns false', async () => {
    const { sut, hashComparerStub } = makeSut();

    jest
      .spyOn(hashComparerStub, 'compare')
      .mockReturnValueOnce(Promise.resolve(false));

    const accessToken = await sut.auth(makeFakeAuth());

    expect(accessToken).toBeNull();
  });

  it('should call TokenGenerator with correct id', async () => {
    const { sut, tokenGeneratorStub } = makeSut();

    const tokenGeneratorSpy = jest.spyOn(tokenGeneratorStub, 'generate');

    await sut.auth(makeFakeAuth());

    expect(tokenGeneratorSpy).toHaveBeenCalledWith('anyid');
  });

  it('should throw if TokenGenerator throws', async () => {
    const { sut, tokenGeneratorStub } = makeSut();

    jest
      .spyOn(tokenGeneratorStub, 'generate')
      .mockReturnValueOnce(Promise.reject(new Error()));

    await expect(sut.auth(makeFakeAuth())).rejects.toThrow();
  });

  it('should return token with correct values', async () => {
    const { sut } = makeSut();

    const accessToken = await sut.auth(makeFakeAuth());

    expect(accessToken).toBe('anyid_token');
  });

  it('should call UpdateAccessTokenRepository with correct values', async () => {
    const { sut, updateAccessTokenRepositoryStub } = makeSut();

    const updateSpy = jest.spyOn(updateAccessTokenRepositoryStub, 'update');

    await sut.auth(makeFakeAuth());

    expect(updateSpy).toHaveBeenCalledWith('anyid', 'anyid_token');
  });

  it('should throw if UpdateAccessTokenRepository throws', async () => {
    const { sut, updateAccessTokenRepositoryStub } = makeSut();

    jest
      .spyOn(updateAccessTokenRepositoryStub, 'update')
      .mockReturnValueOnce(Promise.reject(new Error()));

    await expect(sut.auth(makeFakeAuth())).rejects.toThrow();
  });
});
