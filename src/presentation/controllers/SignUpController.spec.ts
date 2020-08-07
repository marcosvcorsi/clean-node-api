import SignUpController from './SignUpController';
import MissingParamError from '../errors/MissingParamError';

describe('SignUp Controller', () => {
  it('should return 400 if name was not provided', () => {
    const sut = new SignUpController();
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

  it('should return 400 if email was not provided', () => {
    const sut = new SignUpController();
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

  it('should return 400 if password was not provided', () => {
    const sut = new SignUpController();
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
});
