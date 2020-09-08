import {
  Controller,
  HttpResponse,
  LoadSurveys,
} from './LoadSurveysControllerProtocols';
import { ok, serverError, noContent } from '../../../helpers/http/httpHelper';

export class LoadSurveysController implements Controller {
  constructor(private readonly loadSurveys: LoadSurveys) {}

  async handle(): Promise<HttpResponse> {
    try {
      const surveys = await this.loadSurveys.load();

      if (!surveys.length) {
        return noContent();
      }

      return ok(surveys);
    } catch (err) {
      return serverError(err);
    }
  }
}
