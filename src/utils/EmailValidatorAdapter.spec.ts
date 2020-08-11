import validator from 'validator';
import EmailValidatorAdapter from './EmailValidatorAdapter';

jest.mock('validator', () => ({
  isEmail(): boolean {
    return true;
  },
}));

describe('EmailValidator Adapter', () => {
  it('should return false if validator returns false', () => {
    const sut = new EmailValidatorAdapter();

    jest.spyOn(validator, 'isEmail').mockReturnValueOnce(false);

    const isValid = sut.isValid('invalid_email@mail.com');

    expect(isValid).toBe(false);
  });

  it('should return true if validator returns true', () => {
    const sut = new EmailValidatorAdapter();

    const isValid = sut.isValid('valid_email@mail.com');

    expect(isValid).toBe(true);
  });

  it('should call validator with correct email', () => {
    const sut = new EmailValidatorAdapter();

    const spyEmailValidator = jest.spyOn(validator, 'isEmail');

    sut.isValid('any_email@mail.com');

    expect(spyEmailValidator).toHaveBeenCalledWith('any_email@mail.com');
  });
});
