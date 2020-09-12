import { SaveSurveyResultRepository } from '@/data/protocols/db/survey/SaveSurveyResultRepository';
import { SurveyResultModel } from '@/domain/models/SurveyResult';
import { SaveSurveyResultModel } from '@/domain/useCases/SaveSurveyResult';
import { MongoHelper } from '../../helpers/mongoHelper';

export class SurveyResultMongoRepository implements SaveSurveyResultRepository {
  async save(surveyData: SaveSurveyResultModel): Promise<SurveyResultModel> {
    const surveyCollection = await MongoHelper.getCollection('survey_results');

    const { accountId, surveyId, answer, date } = surveyData;

    const res = await surveyCollection.findOneAndUpdate(
      {
        accountId,
        surveyId,
      },
      {
        $set: {
          answer,
          date,
        },
      },
      {
        upsert: true,
        returnOriginal: false,
      },
    );

    return MongoHelper.map<SurveyResultModel>(res.value);
  }
}
