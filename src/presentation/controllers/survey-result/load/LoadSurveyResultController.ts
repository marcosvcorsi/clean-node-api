import { LoadSurveyResult } from '@/domain/useCases/survey-result/LoadSurveyResult';
import {
  Controller,
  HttpRequest,
  HttpResponse,
} from '../save/SaveSurveyResultControllerProtocols';

export class LoadSurveyResultController implements Controller {
  constructor(private readonly loadSurveyResult: LoadSurveyResult) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const { surveyId } = httpRequest.params;

    await this.loadSurveyResult.load(surveyId);

    return null;
  }
}
