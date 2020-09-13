import { EmailValidation } from './EmailValidation';
import { EmailValidator } from '../protocols/emailValidator';
import { InvalidParamError } from '../../presentation/errors';
import { mockEmailValidator } from '../test';

type SutType = {
  sut: EmailValidation;
  emailValidatorStub: EmailValidator;
};

const makeSut = (): SutType => {
  const emailValidatorStub = mockEmailValidator();

  const sut = new EmailValidation('email', emailValidatorStub);

  return {
    sut,
    emailValidatorStub,
  };
};

describe('Email Validation', () => {
  it('should return an error if email was invalid', () => {
    const { sut, emailValidatorStub } = makeSut();

    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false);

    const error = sut.validate({ email: 'anyemail@mail.com' });

    expect(error).toEqual(new InvalidParamError('email'));
  });

  it('should validate the email using EmailValidator', () => {
    const { sut, emailValidatorStub } = makeSut();

    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid');

    sut.validate({ email: 'anyemail@mail.com' });

    expect(isValidSpy).toHaveBeenCalledWith('anyemail@mail.com');
  });

  it('should return an error if EmailValidator throws', () => {
    const { sut, emailValidatorStub } = makeSut();

    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new Error();
    });

    expect(sut.validate).toThrow();
  });
});
