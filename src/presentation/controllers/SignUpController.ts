import { HttpRequest, HttpResponse } from '../protocols/http';
import MissingParamError from '../errors/MissingParamError';
import { badRequest } from '../helpers/httpHelper';
import Controller from '../protocols/controller';

export default class SignUpController implements Controller {
  handle(httpRequest: HttpRequest): HttpResponse {
    const requiredFields = [
      'name',
      'email',
      'password',
      'passwordConfirmation',
    ];

    for (const requiredField of requiredFields) {
      if (!httpRequest.body[requiredField]) {
        return badRequest(new MissingParamError(requiredField));
      }
    }

    return {
      statusCode: 200,
      body: {},
    };
  }
}
