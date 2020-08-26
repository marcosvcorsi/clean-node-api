import { Validation } from '../../protocols/Validation';
import { MissingParamError } from '../../errors';

export class RequiredFieldValidation implements Validation {
  constructor(private readonly fieldName: string) {}

  validate(input: object): Error {
    if (!input[this.fieldName]) {
      return new MissingParamError(this.fieldName);
    }

    return null;
  }
}
