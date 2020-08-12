import { Encrypter } from './DbCreateAccountProtocols';

import DbCreateAccount from './DbCreateAccount';

interface SutType {
  sut: DbCreateAccount;
  encrypterStub: Encrypter;
}

const makeEncrypter = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    async encrypt(value: string): Promise<string> {
      return Promise.resolve(`hashed ${value}`);
    }
  }

  return new EncrypterStub();
};

const makeSut = (): SutType => {
  const encrypterStub = makeEncrypter();

  const sut = new DbCreateAccount(encrypterStub);

  return { sut, encrypterStub };
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
});
