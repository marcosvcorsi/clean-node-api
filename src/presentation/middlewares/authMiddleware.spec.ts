import { forbidden, ok, serverError } from '../helpers/http/httpHelper';
import { AccessDeniedError } from '../errors';
import { AuthMiddleware } from './authMiddleware';
import { LoadAccountByToken } from '../../domain/useCases/LoadAccountByToken';
import { HttpRequest } from '../protocols';

const makeLoadAccountByToken = () => {
  class LoadAccountByTokenStub implements LoadAccountByToken {
    async load() {
      return Promise.resolve({
        id: 'anyid',
        name: 'anyname',
        email: 'anymail@mail.com',
        password: 'anypassword',
      });
    }
  }

  return new LoadAccountByTokenStub();
};

const makeFakeRequest = (): HttpRequest => ({
  headers: {
    Authorization: 'anytoken',
  },
});

interface SutType {
  sut: AuthMiddleware;
  loadAccountByTokenStub: LoadAccountByToken;
}

const makeSut = (): SutType => {
  const loadAccountByTokenStub = makeLoadAccountByToken();

  const sut = new AuthMiddleware(loadAccountByTokenStub);

  return { sut, loadAccountByTokenStub };
};

describe('Auth Middleware', () => {
  it('should return forbidden if no authorization exists', async () => {
    const { sut } = makeSut();

    const response = await sut.handle({});

    expect(response).toEqual(forbidden(new AccessDeniedError()));
  });

  it('should call LoadAccountByToken with correct accessToken', async () => {
    const { sut, loadAccountByTokenStub } = makeSut();

    const loadSpy = jest.spyOn(loadAccountByTokenStub, 'load');

    await sut.handle(makeFakeRequest());

    expect(loadSpy).toHaveBeenCalledWith('anytoken');
  });

  it('should return forbidden if LoadAccountByToken returns null', async () => {
    const { sut, loadAccountByTokenStub } = makeSut();

    jest
      .spyOn(loadAccountByTokenStub, 'load')
      .mockReturnValueOnce(Promise.resolve(null));

    const response = await sut.handle(makeFakeRequest());

    expect(response).toEqual(forbidden(new AccessDeniedError()));
  });

  it('should return ok if no LoadAccountByToken exists', async () => {
    const { sut } = makeSut();

    const response = await sut.handle(makeFakeRequest());

    expect(response).toEqual(ok({ account_id: 'anyid' }));
  });

  it('should return serverError if no LoadAccountByToken throws', async () => {
    const { sut, loadAccountByTokenStub } = makeSut();

    jest
      .spyOn(loadAccountByTokenStub, 'load')
      .mockReturnValueOnce(Promise.reject(new Error()));

    const response = await sut.handle(makeFakeRequest());

    expect(response).toEqual(serverError(new Error()));
  });
});
