import {
  Controller,
  HttpRequest,
  HttpResponse,
  EmailValidator,
  Authentication,
} from './LoginProtocols';
import {
  badRequest,
  ok,
  serverError,
  unauthorized,
} from '../../helpers/httpHelper';

import { MissingParamError, InvalidParamError } from '../../errors';

export class LoginController implements Controller {
  private readonly emailValidator: EmailValidator;

  private readonly authentication: Authentication;

  constructor(emailValidator: EmailValidator, authentication: Authentication) {
    this.emailValidator = emailValidator;
    this.authentication = authentication;
  }

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { email, password } = httpRequest.body;

      if (!email) {
        return badRequest(new MissingParamError('email'));
      }

      if (!password) {
        return badRequest(new MissingParamError('password'));
      }

      if (!this.emailValidator.isValid(email)) {
        return badRequest(new InvalidParamError('email'));
      }

      const accessToken = await this.authentication.auth(email, password);

      if (!accessToken) {
        return unauthorized();
      }

      return ok({ accessToken });
    } catch (error) {
      return serverError(error);
    }
  }
}
