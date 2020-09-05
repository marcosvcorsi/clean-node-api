import { forbidden } from '../helpers/http/httpHelper';
import { AccessDeniedError } from '../errors';
import { AuthMiddleware } from './authMiddleware';

interface SutType {
  sut: AuthMiddleware;
}

const makeSut = (): SutType => {
  const sut = new AuthMiddleware();

  return { sut };
};

describe('Auth Middleware', () => {
  it('should return forbidden if no authorization exists', async () => {
    const { sut } = makeSut();

    const response = await sut.handle({});

    expect(response).toEqual(forbidden(new AccessDeniedError()));
  });
});
