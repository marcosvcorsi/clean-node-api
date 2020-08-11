import validator from 'validator';
import EmailValidatorAdapter from './EmailValidatorAdapter';

jest.mock('validator', () => ({
  isEmail(): boolean {
    return true;
  },
}));

const makeSut = (): EmailValidatorAdapter => {
  return new EmailValidatorAdapter();
};

describe('EmailValidator Adapter', () => {
  it('should return false if validator returns false', () => {
    const sut = makeSut();

    jest.spyOn(validator, 'isEmail').mockReturnValueOnce(false);

    const isValid = sut.isValid('invalid_email@mail.com');

    expect(isValid).toBe(false);
  });

  it('should return true if validator returns true', () => {
    const sut = makeSut();

    const isValid = sut.isValid('valid_email@mail.com');

    expect(isValid).toBe(true);
  });

  it('should call validator with correct email', () => {
    const sut = makeSut();

    const spyEmailValidator = jest.spyOn(validator, 'isEmail');

    sut.isValid('any_email@mail.com');

    expect(spyEmailValidator).toHaveBeenCalledWith('any_email@mail.com');
  });
});
