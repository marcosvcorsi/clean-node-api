import { Decrypter } from '../../protocols/cryptography/Decrypter';
import { DbLoadAccountByToken } from './DbLoadAccountByToken';

const makeDecrypter = (): Decrypter => {
  class DecrypterStub implements Decrypter {
    async decrypt() {
      return 'anyvalue';
    }
  }

  return new DecrypterStub();
};

interface SutType {
  sut: DbLoadAccountByToken;
  decrypterStub: Decrypter;
}

const makeSut = (): SutType => {
  const decrypterStub = makeDecrypter();
  const sut = new DbLoadAccountByToken(decrypterStub);

  return { sut, decrypterStub };
};

describe('DbLoadAccountByToken UseCase', () => {
  it('should call Decrypter with corret values', async () => {
    const { sut, decrypterStub } = makeSut();

    const decrypterSpy = jest.spyOn(decrypterStub, 'decrypt');

    await sut.load('anytoken');

    expect(decrypterSpy).toHaveBeenCalledWith('anytoken');
  });
});
