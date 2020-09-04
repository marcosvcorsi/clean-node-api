import { MongoHelper } from '../../helpers/mongoHelper';
import { CreateSurveyRepository } from '../../../../../data/protocols/db/survey/CreateSurveyRepository';
import { CreateSurveyModel } from '../../../../../domain/useCases/CreateSurvey';

export class SurveyMongoRepository implements CreateSurveyRepository {
  async create(surveyData: CreateSurveyModel): Promise<void> {
    const accountCollection = await MongoHelper.getCollection('surveys');
    await accountCollection.insertOne(surveyData);
  }
}
