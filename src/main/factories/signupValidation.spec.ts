import { makeSignUpValidation } from './signupValidation';
import { ValidationComposite } from '../../presentation/helpers/validators/ValidationComposite';
import { RequiredFieldValidation } from '../../presentation/helpers/validators/RequiredFieldValidation';
import { Validation } from '../../presentation/helpers/validators/Validation';
import { CompareFieldsValidation } from '../../presentation/helpers/validators/CompareFieldsValidation';
import { EmailValidation } from '../../presentation/helpers/validators/EmailValidation';
import { EmailValidator } from '../../presentation/protocols/emailValidator';

jest.mock('../../presentation/helpers/validators/ValidationComposite');

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid(email: string): boolean {
      return !!email;
    }
  }

  return new EmailValidatorStub();
};

describe('SignUpValidation Test', () => {
  it('should call ValidationComposite with all validations', () => {
    makeSignUpValidation();

    const validations: Validation[] = [];

    const requiredFields = [
      'name',
      'email',
      'password',
      'passwordConfirmation',
    ];

    for (const field of requiredFields) {
      validations.push(new RequiredFieldValidation(field));
    }

    validations.push(
      new CompareFieldsValidation('password', 'passwordConfirmation'),
    );

    validations.push(new EmailValidation('email', makeEmailValidator()));

    expect(ValidationComposite).toHaveBeenCalledWith(validations);
  });
});
