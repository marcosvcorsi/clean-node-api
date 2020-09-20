import { serverError } from '@/presentation/helpers/http/httpHelper';
import {
  Controller,
  HttpRequest,
  HttpResponse,
  LoadSurveyResult,
  LoadSurveyById,
} from './LoadSurveyResultControllerProtocols';

export class LoadSurveyResultController implements Controller {
  constructor(
    private readonly loadSurveyById: LoadSurveyById,
    private readonly loadSurveyResult: LoadSurveyResult,
  ) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { surveyId } = httpRequest.params;

      await this.loadSurveyById.loadById(surveyId);

      await this.loadSurveyResult.load(surveyId);

      return null;
    } catch (error) {
      return serverError(error);
    }
  }
}
