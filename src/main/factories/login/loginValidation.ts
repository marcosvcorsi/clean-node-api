import { ValidationComposite } from '../../../presentation/helpers/validators/ValidationComposite';
import { Validation } from '../../../presentation/helpers/validators/Validation';
import { RequiredFieldValidation } from '../../../presentation/helpers/validators/RequiredFieldValidation';
import { EmailValidation } from '../../../presentation/helpers/validators/EmailValidation';
import EmailValidatorAdapter from '../../../utils/EmailValidatorAdapter';

export const makeLoginValidation = (): Validation => {
  const validations: Validation[] = [];

  const requiredFields = ['email', 'password'];

  for (const field of requiredFields) {
    validations.push(new RequiredFieldValidation(field));
  }

  validations.push(new EmailValidation('email', new EmailValidatorAdapter()));

  return new ValidationComposite(validations);
};
