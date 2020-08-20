import { makeLoginValidation } from './loginValidation';
import { ValidationComposite } from '../../../presentation/helpers/validators/ValidationComposite';
import { RequiredFieldValidation } from '../../../presentation/helpers/validators/RequiredFieldValidation';
import { Validation } from '../../../presentation/helpers/validators/Validation';
import { EmailValidation } from '../../../presentation/helpers/validators/EmailValidation';
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
