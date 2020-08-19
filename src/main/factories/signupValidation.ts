import { ValidationComposite } from '../../presentation/helpers/validators/ValidationComposite';
import { Validation } from '../../presentation/helpers/validators/Validation';
import { RequiredFieldValidation } from '../../presentation/helpers/validators/RequiredFieldValidation';

export const makeSignUpValidation = (): Validation => {
  const validations: Validation[] = [];

  const requiredFields = ['name', 'email', 'password', 'passwordConfirmation'];

  for (const field of requiredFields) {
    validations.push(new RequiredFieldValidation(field));
  }

  return new ValidationComposite(validations);
};
