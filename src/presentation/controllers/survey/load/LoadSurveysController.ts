import {
  ok,
  serverError,
  noContent,
} from '@/presentation/helpers/http/httpHelper';
import {
  Controller,
  HttpResponse,
  LoadSurveys,
  HttpRequest,
} from './LoadSurveysControllerProtocols';

export class LoadSurveysController implements Controller {
  constructor(private readonly loadSurveys: LoadSurveys) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const surveys = await this.loadSurveys.load(httpRequest.accountId);

      if (!surveys.length) {
        return noContent();
      }

      return ok(surveys);
    } catch (err) {
      return serverError(err);
    }
  }
}
