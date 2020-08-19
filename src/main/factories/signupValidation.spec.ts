import { makeSignUpValidation } from './signupValidation';
import { ValidationComposite } from '../../presentation/helpers/validators/ValidationComposite';
import { RequiredFieldValidation } from '../../presentation/helpers/validators/RequiredFieldValidation';
import { Validation } from '../../presentation/helpers/validators/Validation';

jest.mock('../../presentation/helpers/validators/ValidationComposite');

describe('SignUpValidation Test', () => {
  it('should call ValidationComposite with all validations', () => {
    makeSignUpValidation();

    const validation: Validation[] = [];

    const requiredFields = [
      'name',
      'email',
      'password',
      'passwordConfirmation',
    ];

    for (const field of requiredFields) {
      validation.push(new RequiredFieldValidation(field));
    }

    expect(ValidationComposite).toHaveBeenCalledWith(validation);
  });
});
