import {
  ValidationComposite,
  RequiredFieldValidation,
  CompareFieldsValidation,
  EmailValidation,
} from '../../../../presentation/helpers/validators';
import { Validation } from '../../../../presentation/protocols/Validation';
import EmailValidatorAdapter from '../../../adapters/validators/EmailValidatorAdapter';

export const makeSignUpValidation = (): Validation => {
  const validations: Validation[] = [];

  const requiredFields = ['name', 'email', 'password', 'passwordConfirmation'];

  for (const field of requiredFields) {
    validations.push(new RequiredFieldValidation(field));
  }

  validations.push(
    new CompareFieldsValidation('password', 'passwordConfirmation'),
  );

  validations.push(new EmailValidation('email', new EmailValidatorAdapter()));

  return new ValidationComposite(validations);
};
