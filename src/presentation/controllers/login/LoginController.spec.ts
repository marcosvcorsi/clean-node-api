import { LoginController } from './LoginController';
import { badRequest } from '../../helpers/httpHelper';
import { MissingParamError } from '../../errors';
import { EmailValidator } from '../signup/SignUpProtocols';

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

    const httpRequest = {
      body: {
        email: 'anymail@mail.com',
        password: 'anypassword',
      },
    };

    await sut.handle(httpRequest);

    expect(isValidSpy).toHaveBeenCalledWith('anymail@mail.com');
  });
});
