import {
  mockAccountModel,
  mockCreateAccountParams,
  throwError,
} from '@/domain/test';
import { mockHasher, mockCreateAccountRepository } from '@/data/test';
import {
  Hasher,
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

const mockLoadAccountByEmailRepository = (): LoadAccountByEmailRepository => {
  class LoadAccountByEmailRepositoryStub
    implements LoadAccountByEmailRepository {
    async loadByEmail(): Promise<AccountModel> {
      return Promise.resolve(null);
    }
  }

  return new LoadAccountByEmailRepositoryStub();
};

const makeSut = (): SutType => {
  const hasherStub = mockHasher();
  const createAccountRepositoryStub = mockCreateAccountRepository();
  const loadAccountByEmailRepositoryStub = mockLoadAccountByEmailRepository();

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

    await sut.create(mockCreateAccountParams());

    expect(encryptSpy).toHaveBeenCalledWith('anypassword');
  });

  it('should throw if Hasher throws', async () => {
    const { sut, hasherStub } = makeSut();

    jest.spyOn(hasherStub, 'hash').mockImplementationOnce(throwError);

    await expect(sut.create(mockCreateAccountParams())).rejects.toThrow();
  });

  it('should call CreateAccountRepository with correct values', async () => {
    const { sut, createAccountRepositoryStub } = makeSut();

    const createAccountSpy = jest.spyOn(createAccountRepositoryStub, 'create');

    const accountData = mockCreateAccountParams();

    await sut.create(mockCreateAccountParams());

    expect(createAccountSpy).toHaveBeenCalledWith(accountData);
  });

  it('should throw if DbCreateAccountRepository throws', async () => {
    const { sut, createAccountRepositoryStub } = makeSut();

    jest
      .spyOn(createAccountRepositoryStub, 'create')
      .mockImplementationOnce(throwError);

    await expect(sut.create(mockCreateAccountParams())).rejects.toThrow();
  });

  it('should return an account on success', async () => {
    const { sut } = makeSut();

    const account = await sut.create(mockCreateAccountParams());

    expect(account).toEqual(mockAccountModel());
  });

  it('should call LoadAccountByEmailRepository with correct email', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut();

    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail');

    await sut.create(mockCreateAccountParams());

    expect(loadSpy).toHaveBeenCalledWith('anymail@mail.com');
  });

  it('should throw if LoadAccountByEmailRepository throws', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut();

    jest
      .spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')
      .mockImplementationOnce(throwError);

    await expect(sut.create(mockCreateAccountParams())).rejects.toThrow();
  });

  it('should return null with LoadAccountByEmailReposity finds one', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut();

    jest
      .spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')
      .mockReturnValueOnce(Promise.resolve(mockAccountModel()));

    const account = await sut.create(mockCreateAccountParams());

    expect(account).toBeNull();
  });
});
