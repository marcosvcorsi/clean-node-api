import { Decrypter } from '../../protocols/cryptography/Decrypter';
import { DbLoadAccountByToken } from './DbLoadAccountByToken';
import { AccountModel } from '../../../domain/models/Account';
import { LoadAccountByTokenRepository } from '../../protocols/db/account/LoadAccountByTokenRepository';

const makeLoadAccountByRepository = () => {
  class LoadAccountByTokenRepositoryStub
    implements LoadAccountByTokenRepository {
    async loadByToken(): Promise<AccountModel> {
      return {
        id: 'anyid',
        name: 'anyname',
        email: 'anymail@mail.com',
        password: 'anypassword',
      };
    }
  }

  return new LoadAccountByTokenRepositoryStub();
};

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
  loadAccountByTokenRepositoryStub: LoadAccountByTokenRepository;
}

const makeSut = (): SutType => {
  const decrypterStub = makeDecrypter();
  const loadAccountByTokenRepositoryStub = makeLoadAccountByRepository();
  const sut = new DbLoadAccountByToken(
    decrypterStub,
    loadAccountByTokenRepositoryStub,
  );

  return { sut, decrypterStub, loadAccountByTokenRepositoryStub };
};

describe('DbLoadAccountByToken UseCase', () => {
  it('should call Decrypter with corret values', async () => {
    const { sut, decrypterStub } = makeSut();

    const decrypterSpy = jest.spyOn(decrypterStub, 'decrypt');

    await sut.load('anytoken', 'anyrole');

    expect(decrypterSpy).toHaveBeenCalledWith('anytoken');
  });

  it('should return null if Decrypter returns null', async () => {
    const { sut, decrypterStub } = makeSut();

    jest.spyOn(decrypterStub, 'decrypt').mockReturnValueOnce(null);

    const response = await sut.load('anytoken', 'anyrole');

    expect(response).toBeNull();
  });

  it('should call LoadAccountByTokenRepository with corret values', async () => {
    const { sut, loadAccountByTokenRepositoryStub } = makeSut();

    const loadSpy = jest.spyOn(loadAccountByTokenRepositoryStub, 'loadByToken');

    await sut.load('anytoken', 'anyrole');

    expect(loadSpy).toHaveBeenCalledWith('anytoken', 'anyrole');
  });

  it('should return null if LoadAccountByTokenRepository return null', async () => {
    const { sut, loadAccountByTokenRepositoryStub } = makeSut();

    jest
      .spyOn(loadAccountByTokenRepositoryStub, 'loadByToken')
      .mockReturnValueOnce(null);

    const response = await sut.load('anytoken', 'anyrole');

    expect(response).toBeNull();
  });

  it('should throw if LoadAccountByTokenRepository throws', async () => {
    const { sut, loadAccountByTokenRepositoryStub } = makeSut();

    jest
      .spyOn(loadAccountByTokenRepositoryStub, 'loadByToken')
      .mockReturnValueOnce(Promise.reject(new Error()));

    await expect(sut.load('anytoken', 'anyrole')).rejects.toThrow();
  });

  it('should return an account on success', async () => {
    const { sut } = makeSut();

    const response = await sut.load('anytoken', 'anyrole');

    expect(response).toEqual({
      id: 'anyid',
      name: 'anyname',
      email: 'anymail@mail.com',
      password: 'anypassword',
    });
  });
});
