import {
  HttpRequest,
  HttpResponse,
  Middleware,
  LoadAccountByToken,
} from './AuthMiddlewareProtocols';
import { forbidden, ok, serverError } from '../helpers/http/httpHelper';
import { AccessDeniedError } from '../errors';

export class AuthMiddleware implements Middleware {
  constructor(
    private readonly loadAccountByToken: LoadAccountByToken,
    private readonly role?: string,
  ) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const accessToken = httpRequest.headers?.['authorization'];

      if (accessToken) {
        const account = await this.loadAccountByToken.load(
          accessToken,
          this.role,
        );

        if (account) {
          return ok({ account_id: account.id });
        }
      }

      return forbidden(new AccessDeniedError());
    } catch (err) {
      return serverError(err);
    }
  }
}
