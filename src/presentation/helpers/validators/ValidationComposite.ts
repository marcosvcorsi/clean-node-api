import { Validation } from '../../protocols/Validation';

export class ValidationComposite implements Validation {
  private readonly validations: Validation[];

  constructor(validations: Validation[]) {
    this.validations = validations;
  }

  validate(input: object): Error {
    for (const validation of this.validations) {
      const validationError = validation.validate(input);

      if (validationError) {
        return validationError;
      }
    }

    return null;
  }
}
