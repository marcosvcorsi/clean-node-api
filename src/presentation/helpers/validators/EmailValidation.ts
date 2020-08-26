import { Validation } from '../../protocols/Validation';
import { EmailValidator } from '../../protocols/emailValidator';
import { InvalidParamError } from '../../errors';

export class EmailValidation implements Validation {
  constructor(
    private readonly fieldName: string,
    private readonly emailValidator: EmailValidator,
  ) {}

  validate(input: object): Error {
    const email = input[this.fieldName];

    if (!this.emailValidator.isValid(email)) {
      return new InvalidParamError(this.fieldName);
    }

    return null;
  }
}
