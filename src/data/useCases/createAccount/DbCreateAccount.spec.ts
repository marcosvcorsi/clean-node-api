import {
  Encrypter,
  CreateAccountModel,
  CreateAccountRepository,
  AccountModel,
} from './DbCreateAccountProtocols';

import DbCreateAccount from './DbCreateAccount';

interface SutType {
  sut: DbCreateAccount;
  encrypterStub: Encrypter;
  createAccountRepositoryStub: CreateAccountRepository;
}

const makeEncrypter = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    async encrypt(value: string): Promise<string> {
      return Promise.resolve(`hashed ${value}`);
    }
  }

  return new EncrypterStub();
};

const makeCreateAccountRepositoryStub = (): CreateAccountRepository => {
  class CreateAccountRepositoryStub implements CreateAccountRepository {
    async create(accountData: CreateAccountModel): Promise<AccountModel> {
      const fakeAccount = {
        ...accountData,
        password: `hashed ${accountData.password}`,
        id: 'valid_id',
      };

      return Promise.resolve(fakeAccount);
    }
  }

  return new CreateAccountRepositoryStub();
};

const makeSut = (): SutType => {
  const encrypterStub = makeEncrypter();
  const createAccountRepositoryStub = makeCreateAccountRepositoryStub();

  const sut = new DbCreateAccount(encrypterStub, createAccountRepositoryStub);

  return { sut, encrypterStub, createAccountRepositoryStub };
};

describe('DbCreateAccount Use Case', () => {
  it('should call Encrypter with correct password', async () => {
    const { sut, encrypterStub } = makeSut();

    const encryptSpy = jest.spyOn(encrypterStub, 'encrypt');

    const accountData = {
      name: 'valid_name',
      email: 'valid_email@mail.com',
      password: 'valid_password',
    };

    await sut.create(accountData);

    expect(encryptSpy).toHaveBeenCalledWith('valid_password');
  });

  it('should throw if Encrypter throws', async () => {
    const { sut, encrypterStub } = makeSut();

    jest
      .spyOn(encrypterStub, 'encrypt')
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
});
