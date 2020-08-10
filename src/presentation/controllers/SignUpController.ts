import { HttpRequest, HttpResponse } from '../protocols/http';
import { badRequest, serverError } from '../helpers/httpHelper';

import { Controller, EmailValidator } from '../protocols';
import { InvalidParamError, MissingParamError } from '../errors';
import CreateAccount from '../../domain/useCases/CreateAccount';

export default class SignUpController implements Controller {
  private readonly emailValidator: EmailValidator;

  private readonly createAccount: CreateAccount;

  constructor(emailValidator: EmailValidator, createAccount: CreateAccount) {
    this.emailValidator = emailValidator;
    this.createAccount = createAccount;
  }

  handle(httpRequest: HttpRequest): HttpResponse {
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

      this.createAccount.create({
        name,
        email,
        password,
      });

      return {
        statusCode: 200,
        body: {},
      };
    } catch (err) {
      return serverError();
    }
  }
}
