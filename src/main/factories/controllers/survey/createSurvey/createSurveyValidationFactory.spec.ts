import { makeCreateSurveyValidation } from './createSurveyValidationFactory';
import {
  ValidationComposite,
  RequiredFieldValidation,
} from '../../../../../validation/validators';
import { Validation } from '../../../../../presentation/protocols/Validation';

jest.mock('../../../../../validation/validators/ValidationComposite');

describe('CreateSurveyValidation Test', () => {
  it('should call ValidationComposite with all validations', () => {
    makeCreateSurveyValidation();

    const validations: Validation[] = [];

    const requiredFields = ['question', 'answers'];

    for (const field of requiredFields) {
      validations.push(new RequiredFieldValidation(field));
    }

    expect(ValidationComposite).toHaveBeenCalledWith(validations);
  });
});
