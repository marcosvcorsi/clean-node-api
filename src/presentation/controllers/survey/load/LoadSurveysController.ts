import {
  Controller,
  HttpResponse,
  LoadSurveys,
} from './LoadSurveysControllerProtocols';
import { ok } from '../../../helpers/http/httpHelper';

export class LoadSurveysController implements Controller {
  constructor(private readonly loadSurveys: LoadSurveys) {}

  async handle(): Promise<HttpResponse> {
    const surveys = await this.loadSurveys.load();

    return ok(surveys);
  }
}
