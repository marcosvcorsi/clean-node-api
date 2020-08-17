import { Controller, HttpRequest, HttpResponse } from '../../protocols';
import { badRequest, ok } from '../../helpers/httpHelper';
import { MissingParamError, InvalidParamError } from '../../errors';
import { EmailValidator } from '../signup/SignUpProtocols';

export class LoginController implements Controller {
  private readonly emailValidator: EmailValidator;

  constructor(emailValidator: EmailValidator) {
    this.emailValidator = emailValidator;
  }

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
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

    return ok({});
  }
}
