import {
  CreateSurvey,
  CreateSurveyParams,
} from '../../../../domain/useCases/survey/CreateSurvey';
import { CreateSurveyRepository } from '../../../protocols/db/survey/CreateSurveyRepository';

export class DbCreateSurvey implements CreateSurvey {
  constructor(
    private readonly createSurveyRepository: CreateSurveyRepository,
  ) {}

  async create(data: CreateSurveyParams): Promise<void> {
    await this.createSurveyRepository.create(data);
  }
}
