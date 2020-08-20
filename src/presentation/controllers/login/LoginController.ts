import {
  Controller,
  HttpRequest,
  HttpResponse,
  Authentication,
  Validation,
} from './LoginProtocols';
import {
  badRequest,
  ok,
  serverError,
  unauthorized,
} from '../../helpers/httpHelper';

export class LoginController implements Controller {
  private readonly authentication: Authentication;

  private readonly validation: Validation;

  constructor(authentication: Authentication, validation: Validation) {
    this.authentication = authentication;
    this.validation = validation;
  }

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const validationError = this.validation.validate(httpRequest.body);

      if (validationError) {
        return badRequest(validationError);
      }

      const { email, password } = httpRequest.body;

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
