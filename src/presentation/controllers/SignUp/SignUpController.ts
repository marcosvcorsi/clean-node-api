import {
  HttpRequest,
  HttpResponse,
  Controller,
  EmailValidator,
  CreateAccount,
} from './SignUpProtocols';

import { badRequest, serverError, created } from '../../helpers/httpHelper';

import { InvalidParamError, MissingParamError } from '../../errors';

export default class SignUpController implements Controller {
  private readonly emailValidator: EmailValidator;

  private readonly createAccount: CreateAccount;

  constructor(emailValidator: EmailValidator, createAccount: CreateAccount) {
    this.emailValidator = emailValidator;
    this.createAccount = createAccount;
  }

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const requiredFields = [
        'name',
        'email',
        'password',
        'passwordConfirmation',
      ];

      for (const requiredField of requiredFields) {
        if (!httpRequest.body[requiredField]) {
          return badRequest(new MissingParamError(requiredField));
        }
      }

      const { name, email, password, passwordConfirmation } = httpRequest.body;

      if (password !== passwordConfirmation) {
        return badRequest(new InvalidParamError('passwordConfirmation'));
      }

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
