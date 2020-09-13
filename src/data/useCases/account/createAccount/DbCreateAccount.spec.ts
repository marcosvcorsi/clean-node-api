import {
  Hasher,
  CreateAccountModel,
  CreateAccountRepository,
  AccountModel,
} from './DbCreateAccountProtocols';

import DbCreateAccount from './DbCreateAccount';
import { LoadAccountByEmailRepository } from '../authentication/DbAuthenticationProtocols';

type SutType = {
  sut: DbCreateAccount;
  hasherStub: Hasher;
  createAccountRepositoryStub: CreateAccountRepository;
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository;
};

const makeHasher = (): Hasher => {
  class HasherStub implements Hasher {
    async hash(value: string): Promise<string> {
      return Promise.resolve(`hashed ${value}`);
    }
  }

  return new HasherStub();
};

const makeCreateAccountRepositoryStub = (): CreateAccountRepository => {
  class CreateAccountRepositoryStub implements CreateAccountRepository {
    async create(accountData: CreateAccountModel): Promise<AccountModel> {
      const fakeAccount = {
        ...accountData,
        id: 'valid_id',
      };

      return Promise.resolve(fakeAccount);
    }
  }

  return new CreateAccountRepositoryStub();
};

const makeLoadAccountByEmailRepository = (): LoadAccountByEmailRepository => {
  class LoadAccountByEmailRepositoryStub
    implements LoadAccountByEmailRepository {
    async loadByEmail(): Promise<AccountModel> {
      return Promise.resolve(null);
    }
  }

  return new LoadAccountByEmailRepositoryStub();
};

const makeSut = (): SutType => {
  const hasherStub = makeHasher();
  const createAccountRepositoryStub = makeCreateAccountRepositoryStub();
  const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepository();

  const sut = new DbCreateAccount(
    hasherStub,
    createAccountRepositoryStub,
    loadAccountByEmailRepositoryStub,
  );

  return {
    sut,
    hasherStub,
    createAccountRepositoryStub,
    loadAccountByEmailRepositoryStub,
  };
};

describe('DbCreateAccount Use Case', () => {
  it('should call Hasher with correct password', async () => {
    const { sut, hasherStub } = makeSut();

    const encryptSpy = jest.spyOn(hasherStub, 'hash');

    const accountData = {
      name: 'valid_name',
      email: 'valid_email@mail.com',
      password: 'valid_password',
    };

    await sut.create(accountData);

    expect(encryptSpy).toHaveBeenCalledWith('valid_password');
  });

  it('should throw if Hasher throws', async () => {
    const { sut, hasherStub } = makeSut();

    jest
      .spyOn(hasherStub, 'hash')
      .mockReturnValueOnce(Promise.reject(new Error()));

    const accountData = {
      name: 'valid_name',
      email: 'valid_email@mail.com',
      password: 'valid_password',
    };

    await expect(sut.create(accountData)).rejects.toThrow();
  });

  it('should call CreateAccountRepository with correct values', async () => {
    const { sut, createAccountRepositoryStub } = makeSut();

    const createAccountSpy = jest.spyOn(createAccountRepositoryStub, 'create');

    const accountData = {
      name: 'valid_name',
      email: 'valid_email@mail.com',
      password: 'valid_password',
    };

    await sut.create(accountData);

    expect(createAccountSpy).toHaveBeenCalledWith({
      name: 'valid_name',
      email: 'valid_email@mail.com',
      password: 'hashed valid_password',
    });
  });

  it('should throw if DbCreateAccountRepository throws', async () => {
    const { sut, createAccountRepositoryStub } = makeSut();

    jest
      .spyOn(createAccountRepositoryStub, 'create')
      .mockReturnValueOnce(Promise.reject(new Error()));

    const accountData = {
      name: 'valid_name',
      email: 'valid_email@mail.com',
      password: 'valid_password',
    };

    await expect(sut.create(accountData)).rejects.toThrow();
  });

  it('should return an account on success', async () => {
    const { sut } = makeSut();

    const accountData = {
      name: 'valid_name',
      email: 'valid_email@mail.com',
      password: 'valid_password',
    };

    const account = await sut.create(accountData);

    expect(account).toEqual({
      id: 'valid_id',
      name: 'valid_name',
      email: 'valid_email@mail.com',
      password: 'hashed valid_password',
    });
  });

  it('should call LoadAccountByEmailRepository with correct email', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut();

    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail');

    await sut.create({
      name: 'valid_name',
      email: 'valid_email@mail.com',
      password: 'valid_password',
    });

    expect(loadSpy).toHaveBeenCalledWith('valid_email@mail.com');
  });

  it('should throw if LoadAccountByEmailRepository throws', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut();

    jest
      .spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')
      .mockReturnValueOnce(Promise.reject(new Error()));

    await expect(
      sut.create({
        name: 'valid_name',
        email: 'valid_email@mail.com',
        password: 'valid_password',
      }),
    ).rejects.toThrow();
  });

  it('should return null with LoadAccountByEmailReposity finds one', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut();

    jest
      .spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')
      .mockReturnValueOnce(
        Promise.resolve({
          id: 'valid_id',
          name: 'valid_name',
          email: 'valid_email@mail.com',
          password: 'valid_password',
        }),
      );

    const accountData = {
      name: 'valid_name',
      email: 'valid_email@mail.com',
      password: 'valid_password',
    };

    const account = await sut.create(accountData);

    expect(account).toBeNull();
  });
});