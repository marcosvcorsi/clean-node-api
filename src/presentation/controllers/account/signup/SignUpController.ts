import {
  badRequest,
  serverError,
  created,
  forbidden,
} from '@/presentation/helpers/http/httpHelper';
import { EmailInUseError } from '@/presentation/errors';
import {
  HttpRequest,
  HttpResponse,
  Controller,
  CreateAccount,
  Validation,
  Authentication,
} from './SignUpControllerProtocols';

export default class SignUpController implements Controller {
  constructor(
    private readonly createAccount: CreateAccount,
    private readonly validation: Validation,
    private readonly authentication: Authentication,
  ) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const validationError = this.validation.validate(httpRequest.body);

      if (validationError) {
        return badRequest(validationError);
      }

      const { name, email, password } = httpRequest.body;

      const account = await this.createAccount.create({
        name,
        email,
        password,
      });

      if (!account) {
        return forbidden(new EmailInUseError());
      }

      const authenticationModel = await this.authentication.auth({
        email,
        password,
      });

      return created(authenticationModel);
    } catch (error) {
      return serverError(error);
    }
  }
}
