import { HttpRequest, HttpResponse, Middleware } from '../protocols';
import { forbidden, ok, serverError } from '../helpers/http/httpHelper';
import { AccessDeniedError } from '../errors';
import { LoadAccountByToken } from '../../domain/useCases/LoadAccountByToken';

export class AuthMiddleware implements Middleware {
  constructor(private readonly loadAccountByToken: LoadAccountByToken) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const accessToken = httpRequest.headers?.['Authorization'];

      if (accessToken) {
        const account = await this.loadAccountByToken.load(accessToken);

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
