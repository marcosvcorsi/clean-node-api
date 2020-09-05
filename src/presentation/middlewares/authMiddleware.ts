import { HttpRequest, HttpResponse, Middleware } from '../protocols';
import { forbidden } from '../helpers/http/httpHelper';
import { AccessDeniedError } from '../errors';
import { LoadAccountByToken } from '../../domain/useCases/LoadAccountByToken';

export class AuthMiddleware implements Middleware {
  constructor(private readonly loadAccountByToken: LoadAccountByToken) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const accessToken = httpRequest.headers?.['Authorization'];

    if (accessToken) {
      await this.loadAccountByToken.load(accessToken);
    }

    return forbidden(new AccessDeniedError());
  }
}
