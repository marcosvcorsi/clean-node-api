import { Controller, HttpRequest, HttpResponse } from '../../protocols';
import { badRequest } from '../../helpers/httpHelper';
import { MissingParamError } from '../../errors';

export class LoginController implements Controller {
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    console.log(httpRequest);

    return badRequest(new MissingParamError('email'));
  }
}
