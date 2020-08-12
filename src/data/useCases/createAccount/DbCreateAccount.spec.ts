import DbCreateAccount from './DbCreateAccount';

describe('DbCreateAccount Use Case', () => {
  it('should call Encrypter with correct password', async () => {
    class EncrypterStub {
      async encrypt(value: string): Promise<string> {
        return Promise.resolve(`hashed ${value}`);
      }
    }

    const encrypterStub = new EncrypterStub();

    const sut = new DbCreateAccount(encrypterStub);

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
