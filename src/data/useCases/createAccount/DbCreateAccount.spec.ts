import DbCreateAccount from './DbCreateAccount';
import Encrypter from '../../protocols/Encrypter';

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
});
