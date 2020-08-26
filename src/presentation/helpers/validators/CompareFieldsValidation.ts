import { Validation } from '../../protocols/Validation';
import { InvalidParamError } from '../../errors';

export class CompareFieldsValidation implements Validation {
  constructor(
    private readonly fieldName: string,
    private readonly fieldToCompareName: string,
  ) {}

  validate(input: object): Error {
    if (input[this.fieldName] !== input[this.fieldToCompareName]) {
      return new InvalidParamError(this.fieldToCompareName);
    }

    return null;
  }
}
