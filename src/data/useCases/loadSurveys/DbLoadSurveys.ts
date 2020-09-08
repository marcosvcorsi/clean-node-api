import { LoadSurveys } from '../../../domain/useCases/LoadSurveys';
import { SurveyModel } from '../../../domain/models/Survey';
import { LoadSurveysRepository } from '../../protocols/db/survey/LoadSurveysRepository';

export class DbLoadSurveys implements LoadSurveys {
  constructor(private readonly loadSurveysRepository: LoadSurveysRepository) {}

  async load(): Promise<SurveyModel[]> {
    await this.loadSurveysRepository.loadAll();

    return null;
  }
}
