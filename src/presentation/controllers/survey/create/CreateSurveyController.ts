import {
  Controller,
  HttpRequest,
  HttpResponse,
  Validation,
} from './CreateSurveyControllerProtocols';
import { ok } from '../../../helpers/http/httpHelper';

export class CreateSurveyController implements Controller {
  constructor(private readonly validation: Validation) {}

  handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    this.validation.validate(httpRequest.body);

    return Promise.resolve(ok(httpRequest));
  }
}
