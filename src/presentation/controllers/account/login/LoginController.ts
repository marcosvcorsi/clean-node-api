import {
  badRequest,
  ok,
  serverError,
  unauthorized,
} from '@/presentation/helpers/http/httpHelper';
import {
  Controller,
  HttpRequest,
  HttpResponse,
  Authentication,
  Validation,
} from './LoginControllerProtocols';

export class LoginController implements Controller {
  constructor(
    private readonly authentication: Authentication,
    private readonly validation: Validation,
  ) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const validationError = this.validation.validate(httpRequest.body);

      if (validationError) {
        return badRequest(validationError);
      }

      const { email, password } = httpRequest.body;

      const authenticationModel = await this.authentication.auth({
        email,
        password,
      });

      if (!authenticationModel) {
        return unauthorized();
      }

      return ok(authenticationModel);
    } catch (error) {
      return serverError(error);
    }
  }
}
