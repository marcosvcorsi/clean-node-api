import { makeLoginValidation } from './loginValidationFactory';
import {
  ValidationComposite,
  RequiredFieldValidation,
  EmailValidation,
} from '../../../../../validation/validators';
import { Validation } from '../../../../../presentation/protocols/Validation';
import { EmailValidator } from '../../../../../validation/protocols/emailValidator';

jest.mock('../../../../../validation/validators/ValidationComposite');

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid(email: string): boolean {
      return !!email;
    }
  }

  return new EmailValidatorStub();
};

describe('LoginValidation Test', () => {
  it('should call ValidationComposite with all validations', () => {
    makeLoginValidation();

    const validations: Validation[] = [];

    const requiredFields = ['email', 'password'];

    for (const field of requiredFields) {
      validations.push(new RequiredFieldValidation(field));
    }

    validations.push(new EmailValidation('email', makeEmailValidator()));

    expect(ValidationComposite).toHaveBeenCalledWith(validations);
  });
});
