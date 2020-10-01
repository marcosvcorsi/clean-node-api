import { CreateSurveyRepository } from '@/data/protocols/db/survey/CreateSurveyRepository';
import { CreateSurveyParams } from '@/domain/useCases/survey/CreateSurvey';
import { LoadSurveysRepository } from '@/data/protocols/db/survey/LoadSurveysRepository';
import { SurveyModel } from '@/domain/models/Survey';

import { LoadSurveyByIdRepository } from '@/data/protocols/db/survey/LoadSurveyByIdRepository';
import { ObjectId } from 'mongodb';
import { MongoHelper } from '../../helpers/mongoHelper';
import { QueryBuilder } from '../../helpers/queryBuilder';

export class SurveyMongoRepository
  implements
    CreateSurveyRepository,
    LoadSurveysRepository,
    LoadSurveyByIdRepository {
  async loadAll(accountId: string): Promise<SurveyModel[]> {
    const surveyCollection = await MongoHelper.getCollection('surveys');

    const query = new QueryBuilder()
      .lookup({
        from: 'survey_results',
        foreignField: 'surveyId',
        localField: '_id',
        as: 'result',
      })
      .project({
        _id: 1,
        question: 1,
        answers: 1,
        date: 1,
        didAnswer: {
          $gte: [
            {
              $size: {
                $filter: {
                  input: '$result',
                  as: 'item',
                  cond: {
                    $eq: ['$$item.accountId', new ObjectId(accountId)],
                  },
                },
              },
            },
            1,
          ],
        },
      })
      .build();

    const surveys = await surveyCollection.aggregate(query).toArray();

    return MongoHelper.mapCollection(surveys);
  }

  async create(surveyData: CreateSurveyParams): Promise<void> {
    const surveyCollection = await MongoHelper.getCollection('surveys');

    await surveyCollection.insertOne(surveyData);
  }

  async loadById(id: string): Promise<SurveyModel> {
    const surveyCollection = await MongoHelper.getCollection('surveys');

    const survey = await surveyCollection.findOne({ _id: new ObjectId(id) });

    return MongoHelper.map(survey);
  }
}
