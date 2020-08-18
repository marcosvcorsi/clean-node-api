import { LoginController } from './LoginController';
import { badRequest, serverError } from '../../helpers/httpHelper';
import { MissingParamError, InvalidParamError } from '../../errors';
import { EmailValidator, HttpRequest } from '../signup/SignUpProtocols';

interface SutType {
  sut: LoginController;
  emailValidatorStub: EmailValidator;
}

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid(email: string): boolean {
      return !!email;
    }
  }

  return new EmailValidatorStub();
};

const makeSut = (): SutType => {
  const emailValidatorStub = makeEmailValidator();
  const sut = new LoginController(emailValidatorStub);

  return {
    sut,
    emailValidatorStub,
  };
};

const makeFakeRequest = (): HttpRequest => ({
  body: {
    email: 'anymail@mail.com',
    password: 'anypassword',
  },
});

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

  it('should call EmailValidator with correct email', async () => {
    const { sut, emailValidatorStub } = makeSut();

    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid');

    await sut.handle(makeFakeRequest());

    expect(isValidSpy).toHaveBeenCalledWith('anymail@mail.com');
  });

  it('should return an error if email is invalid', async () => {
    const { sut, emailValidatorStub } = makeSut();

    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false);

    const httpReponse = await sut.handle(makeFakeRequest());

    expect(httpReponse).toEqual(badRequest(new InvalidParamError('email')));
  });

  it('should return an error if email validator throws', async () => {
    const { sut, emailValidatorStub } = makeSut();

    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new Error();
    });

    const httpReponse = await sut.handle(makeFakeRequest());

    expect(httpReponse).toEqual(serverError(new Error()));
  });
});
