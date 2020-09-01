import { Validation } from '../../presentation/protocols';

export class ValidationComposite implements Validation {
  constructor(private readonly validations: Validation[]) {}

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
