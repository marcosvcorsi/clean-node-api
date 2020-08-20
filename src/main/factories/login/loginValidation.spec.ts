import { makeLoginValidation } from './loginValidation';
import {
  ValidationComposite,
  RequiredFieldValidation,
  EmailValidation,
} from '../../../presentation/helpers/validators';
import { Validation } from '../../../presentation/protocols/Validation';
import { EmailValidator } from '../../../presentation/protocols/emailValidator';

jest.mock('../../../presentation/helpers/validators/ValidationComposite');

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
