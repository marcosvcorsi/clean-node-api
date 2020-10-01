import {
  LoadSurveysRepository,
  LoadSurveys,
  SurveyModel,
} from './DbLoadSurveysProtocols';

export class DbLoadSurveys implements LoadSurveys {
  constructor(private readonly loadSurveysRepository: LoadSurveysRepository) {}

  async load(accountId: string): Promise<SurveyModel[]> {
    const surveys = await this.loadSurveysRepository.loadAll(accountId);

    return surveys;
  }
}
