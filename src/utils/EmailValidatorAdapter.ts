import { EmailValidator } from '../presentation/protocols/emailValidator';

export default class EmailValidatorAdapter implements EmailValidator {
  isValid(email: string): boolean {
    console.log(email);

    return false;
  }
}
