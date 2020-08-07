import { HttpRequest, HttpResponse } from '../protocols/http';
import MissingParamError from '../errors/MissingParamError';
import { badRequest } from '../helpers/httpHelper';

export default class SignUpController {
  handle(request: HttpRequest): HttpResponse {
    const requiredFields = ['name', 'email', 'password'];

    for (const requiredField of requiredFields) {
      if (!request.body[requiredField]) {
        return badRequest(new MissingParamError(requiredField));
      }
    }

    return {
      statusCode: 200,
      body: {},
    };
  }
}
