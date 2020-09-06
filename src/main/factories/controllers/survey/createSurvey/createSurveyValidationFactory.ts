import {
  ValidationComposite,
  RequiredFieldValidation,
} from '../../../../../validation/validators';
import { Validation } from '../../../../../presentation/protocols/Validation';

export const makeCreateSurveyValidation = (): Validation => {
  const validations: Validation[] = [];

  const requiredFields = ['question', 'answers'];

  for (const field of requiredFields) {
    validations.push(new RequiredFieldValidation(field));
  }

  return new ValidationComposite(validations);
};
