import { mockDecrypter, mockLoadAccountByTokenRepository } from '@/data/test';
import { mockAccountModel, throwError } from '@/domain/test';
import { DbLoadAccountByToken } from './DbLoadAccountByToken';
import {
  LoadAccountByTokenRepository,
  Decrypter,
} from './DbLoadAccountByTokenProtocols';

type SutType = {
  sut: DbLoadAccountByToken;
  decrypterStub: Decrypter;
  loadAccountByTokenRepositoryStub: LoadAccountByTokenRepository;
};

const makeSut = (): SutType => {
  const decrypterStub = mockDecrypter();
  const loadAccountByTokenRepositoryStub = mockLoadAccountByTokenRepository();
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

  it('should throw if Decrypter throws', async () => {
    const { sut, decrypterStub } = makeSut();

    jest.spyOn(decrypterStub, 'decrypt').mockImplementationOnce(throwError);

    const account = await sut.load('anytoken', 'anyrole');

    expect(account).toBeNull();
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
      .mockImplementationOnce(throwError);

    await expect(sut.load('anytoken', 'anyrole')).rejects.toThrow();
  });

  it('should return an account on success', async () => {
    const { sut } = makeSut();

    const response = await sut.load('anytoken', 'anyrole');

    expect(response).toEqual(mockAccountModel());
  });
});
