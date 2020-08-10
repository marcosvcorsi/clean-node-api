import SignUpController from './SignUpController';
import MissingParamError from '../errors/MissingParamError';

const makeSut = (): SignUpController => {
  return new SignUpController();
};

describe('SignUp Controller', () => {
  it('should return an error if name was not provided', () => {
    const sut = makeSut();
    const httpRequest = {
      body: {
        email: 'anymail@mail.com',
        password: 'anypassword',
        passwordConfirmation: 'anypassword',
      },
    };

    const httpResponse = sut.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError('name'));
  });

  it('should return an error if email was not provided', () => {
    const sut = makeSut();
    const httpRequest = {
      body: {
        name: 'anyname',
        password: 'anypassword',
        passwordConfirmation: 'anypassword',
      },
    };

    const httpResponse = sut.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError('email'));
  });

  it('should return an error if password was not provided', () => {
    const sut = makeSut();
    const httpRequest = {
      body: {
        name: 'anyname',
        email: 'anymail@mail.com',
        passwordConfirmation: 'anypassword',
      },
    };

    const httpResponse = sut.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError('password'));
  });

  it('should return an error if password confirmation was not provided', () => {
    const sut = makeSut();
    const httpRequest = {
      body: {
        name: 'anyname',
        email: 'anymail@mail.com',
        password: 'anypassword',
      },
    };

    const httpResponse = sut.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(
      new MissingParamError('passwordConfirmation'),
    );
  });
});
