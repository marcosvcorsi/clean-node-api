import { MongoHelper } from '../../helpers/mongoHelper';
import { CreateSurveyRepository } from '../../../../../data/protocols/db/survey/CreateSurveyRepository';
import { CreateSurveyModel } from '../../../../../domain/useCases/CreateSurvey';
import { LoadSurveysRepository } from '../../../../../data/protocols/db/survey/LoadSurveysRepository';
import { SurveyModel } from '../../../../../domain/models/Survey';

export class SurveyMongoRepository
  implements CreateSurveyRepository, LoadSurveysRepository {
  async loadAll(): Promise<SurveyModel[]> {
    const surveyCollection = await MongoHelper.getCollection('surveys');

    const surveys = await surveyCollection.find().toArray();

    return surveys.map(survey => MongoHelper.map<SurveyModel>(survey));
  }

  async create(surveyData: CreateSurveyModel): Promise<void> {
    const surveyCollection = await MongoHelper.getCollection('surveys');

    await surveyCollection.insertOne(surveyData);
  }
}
