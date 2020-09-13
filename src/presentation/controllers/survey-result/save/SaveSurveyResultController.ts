import { InvalidParamError } from '@/presentation/errors';
import {
  forbidden,
  ok,
  serverError,
} from '@/presentation/helpers/http/httpHelper';
import {
  Controller,
  HttpRequest,
  HttpResponse,
  LoadSurveyById,
  SaveSurveyResult,
} from './SaveSurveyResultControllerProtocols';

export class SaveSurveyController implements Controller {
  constructor(
    private readonly loadSurveyById: LoadSurveyById,
    private readonly saveSurveyResult: SaveSurveyResult,
  ) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { surveyId } = httpRequest.params;
      const { answer } = httpRequest.body;

      const survey = await this.loadSurveyById.loadById(surveyId);

      if (!survey) {
        return forbidden(new InvalidParamError('surveyId'));
      }

      if (!survey.answers.some(a => a.answer === answer)) {
        return forbidden(new InvalidParamError('answer'));
      }

      const { accountId } = httpRequest;

      const surveyResult = await this.saveSurveyResult.save({
        surveyId,
        accountId,
        answer,
        date: new Date(),
      });

      return ok(surveyResult);
    } catch (err) {
      return serverError(err);
    }
  }
}
