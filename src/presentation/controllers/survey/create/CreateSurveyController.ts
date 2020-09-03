import {
  Controller,
  HttpRequest,
  HttpResponse,
  Validation,
} from './CreateSurveyControllerProtocols';
import { ok, badRequest } from '../../../helpers/http/httpHelper';

export class CreateSurveyController implements Controller {
  constructor(private readonly validation: Validation) {}

  handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const validationError = this.validation.validate(httpRequest.body);

    if (validationError) {
      return Promise.resolve(badRequest(validationError));
    }

    return Promise.resolve(ok(httpRequest));
  }
}
