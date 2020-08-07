import { HttpRequest, HttpResponse } from '../protocols/http';
import MissingParamError from '../errors/MissingParamError';
import { badRequest } from '../helpers/httpHelper';

export default class SignUpController {
  handle(request: HttpRequest): HttpResponse {
    if (!request.body.name) {
      return badRequest(new MissingParamError('name'));
    }

    if (!request.body.email) {
      return badRequest(new MissingParamError('email'));
    }

    return {
      statusCode: 200,
      body: {},
    };
  }
}
