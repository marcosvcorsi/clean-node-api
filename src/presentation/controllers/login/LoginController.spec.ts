import { LoginController } from './LoginController';
import { badRequest } from '../../helpers/httpHelper';
import { MissingParamError } from '../../errors';

interface SutType {
  sut: LoginController;
}

const makeSut = (): SutType => {
  const sut = new LoginController();

  return {
    sut,
  };
};

describe('LoginController', () => {
  it('should return an error with no email was provided', async () => {
    const { sut } = makeSut();

    const httpRequest = {
      body: {
        password: 'anypassword',
      },
    };

    const httpReponse = await sut.handle(httpRequest);

    expect(httpReponse).toEqual(badRequest(new MissingParamError('email')));
  });

  it('should return an error with no password was provided', async () => {
    const { sut } = makeSut();

    const httpRequest = {
      body: {
        email: 'anymail@mail.com',
      },
    };

    const httpReponse = await sut.handle(httpRequest);

    expect(httpReponse).toEqual(badRequest(new MissingParamError('password')));
  });
});
