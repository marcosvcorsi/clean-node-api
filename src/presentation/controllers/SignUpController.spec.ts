/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import SignUpController from './SignUpController';
import MissingParamError from '../errors/MissingParamError';
import InvalidParamError from '../errors/InvalidParamError';
import EmailValidator from '../protocols/emailValidator';
import ServerError from '../errors/ServerError';

interface SutType {
  sut: SignUpController;
  emailValidatorStub: EmailValidator;
}

const makeSut = (): SutType => {
  class EmailValidatorStub implements EmailValidator {
    isValid(email: string): boolean {
      return true;
    }
  }

  const emailValidatorStub = new EmailValidatorStub();

  const sut = new SignUpController(emailValidatorStub);

  return {
    sut,
    emailValidatorStub,
  };
};

describe('SignUp Controller', () => {
  it('should return an error if name was not provided', () => {
    const { sut } = makeSut();
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
    const { sut } = makeSut();
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
    const { sut } = makeSut();
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
    const { sut } = makeSut();

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

  it('should return an error if email was invalid', () => {
    const { sut, emailValidatorStub } = makeSut();

    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false);

    const httpRequest = {
      body: {
        name: 'anyname',
        email: 'invalid_email@mail.com',
        password: 'anypassword',
        passwordConfirmation: 'anypassword',
      },
    };

    const httpResponse = sut.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new InvalidParamError('email'));
  });

  it('should validate the email using EmailValidator', () => {
    const { sut, emailValidatorStub } = makeSut();

    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid');

    const httpRequest = {
      body: {
        name: 'anyname',
        email: 'anyemail@mail.com',
        password: 'anypassword',
        passwordConfirmation: 'anypassword',
      },
    };

    sut.handle(httpRequest);

    expect(isValidSpy).toHaveBeenCalledWith('anyemail@mail.com');
  });

  it('should return an server error if EmailValidator throws', () => {
    const { sut, emailValidatorStub } = makeSut();

    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new Error();
    });

    const httpRequest = {
      body: {
        name: 'anyname',
        email: 'anyemail@mail.com',
        password: 'anypassword',
        passwordConfirmation: 'anypassword',
      },
    };

    const httpResponse = sut.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(500);
    expect(httpResponse.body).toEqual(new ServerError());
  });
});
