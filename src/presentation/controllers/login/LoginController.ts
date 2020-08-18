import { Controller, HttpRequest, HttpResponse } from '../../protocols';
import { badRequest, ok, serverError } from '../../helpers/httpHelper';
import { MissingParamError, InvalidParamError } from '../../errors';
import { EmailValidator } from '../signup/SignUpProtocols';
import { Authentication } from '../../../domain/useCases/Authentication';

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

      await this.authentication.auth(email, password);

      return ok({});
    } catch (error) {
      return serverError(error);
    }
  }
}
