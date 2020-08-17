import { Controller, HttpRequest, HttpResponse } from '../../protocols';
import { badRequest, ok } from '../../helpers/httpHelper';
import { MissingParamError } from '../../errors';

export class LoginController implements Controller {
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    if (!httpRequest.body.email) {
      return badRequest(new MissingParamError('email'));
    }

    if (!httpRequest.body.password) {
      return badRequest(new MissingParamError('password'));
    }

    return ok({});
  }
}
