import { HttpRequest, HttpResponse, Middleware } from '../protocols';
import { forbidden } from '../helpers/http/httpHelper';
import { AccessDeniedError } from '../errors';

export class AuthMiddleware implements Middleware {
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    console.log(httpRequest);

    return forbidden(new AccessDeniedError());
  }
}
