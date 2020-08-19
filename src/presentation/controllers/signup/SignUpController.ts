import {
  HttpRequest,
  HttpResponse,
  Controller,
  EmailValidator,
  CreateAccount,
  Validation,
} from './SignUpProtocols';

import { badRequest, serverError, created } from '../../helpers/httpHelper';

import { InvalidParamError } from '../../errors';

export default class SignUpController implements Controller {
  private readonly emailValidator: EmailValidator;

  private readonly createAccount: CreateAccount;

  private readonly validation: Validation;

  constructor(
    emailValidator: EmailValidator,
    createAccount: CreateAccount,
    validation: Validation,
  ) {
    this.emailValidator = emailValidator;
    this.createAccount = createAccount;
    this.validation = validation;
  }

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const validationError = this.validation.validate(httpRequest.body);

      if (validationError) {
        return badRequest(validationError);
      }

      const { name, email, password } = httpRequest.body;

      if (!this.emailValidator.isValid(email)) {
        return badRequest(new InvalidParamError('email'));
      }

      const account = await this.createAccount.create({
        name,
        email,
        password,
      });

      return created(account);
    } catch (error) {
      return serverError(error);
    }
  }
}
