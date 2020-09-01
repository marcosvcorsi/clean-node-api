import {
  ValidationComposite,
  EmailValidation,
  RequiredFieldValidation,
} from '../../../../presentation/helpers/validators';
import { Validation } from '../../../../presentation/protocols/Validation';
import EmailValidatorAdapter from '../../../adapters/validators/EmailValidatorAdapter';

export const makeLoginValidation = (): Validation => {
  const validations: Validation[] = [];

  const requiredFields = ['email', 'password'];

  for (const field of requiredFields) {
    validations.push(new RequiredFieldValidation(field));
  }

  validations.push(new EmailValidation('email', new EmailValidatorAdapter()));

  return new ValidationComposite(validations);
};
