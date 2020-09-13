import { InvalidParamError } from '@/presentation/errors';
import { forbidden } from '@/presentation/helpers/http/httpHelper';
import {
  Controller,
  HttpRequest,
  HttpResponse,
  LoadSurveyById,
} from './SaveSurveyResultControllerProtocols';

export class SaveSurveyController implements Controller {
  constructor(private readonly loadSurveyById: LoadSurveyById) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const { surveyId } = httpRequest.params;

    const survey = await this.loadSurveyById.loadById(surveyId);

    if (!survey) {
      return forbidden(new InvalidParamError('surveyId'));
    }

    return null;
  }
}
