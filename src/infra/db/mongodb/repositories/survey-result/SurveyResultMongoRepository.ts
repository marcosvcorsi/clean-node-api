import { SaveSurveyResultRepository } from '@/data/protocols/db/survey-result/SaveSurveyResultRepository';
import { SurveyResultModel } from '@/domain/models/SurveyResult';
import { SaveSurveyResultParams } from '@/domain/useCases/survey-result/SaveSurveyResult';
import { ObjectId } from 'mongodb';
import { MongoHelper } from '../../helpers/mongoHelper';
import { QueryBuilder } from '../../helpers/queryBuilder';

export class SurveyResultMongoRepository implements SaveSurveyResultRepository {
  async save(surveyData: SaveSurveyResultParams): Promise<SurveyResultModel> {
    const surveyCollection = await MongoHelper.getCollection('survey_results');

    const { accountId, surveyId, answer, date } = surveyData;

    await surveyCollection.findOneAndUpdate(
      {
        accountId: new ObjectId(accountId),
        surveyId: new ObjectId(surveyId),
      },
      {
        $set: {
          answer,
          date,
        },
      },
      {
        upsert: true,
      },
    );

    const surveyResult = await this.loadBySurveyId(surveyId);

    return surveyResult;
  }

  private async loadBySurveyId(surveyId: string): Promise<SurveyResultModel> {
    const surveyCollection = await MongoHelper.getCollection('survey_results');

    const query = new QueryBuilder()
      .match({
        surveyId: new ObjectId(surveyId),
      })
      .group({
        _id: 0,
        data: {
          $push: '$$ROOT',
        },
        count: {
          $sum: 1,
        },
      })
      .unwind({
        path: '$data',
      })
      .lookup({
        from: 'surveys',
        foreignField: '_id',
        localField: 'data.surveyId',
        as: 'survey',
      })
      .unwind({
        path: '$survey',
      })
      .group({
        _id: {
          surveyId: '$survey._id',
          question: '$survey.question',
          date: '$survey.date',
          total: '$count',
          answer: {
            $filter: {
              input: '$survey.answers',
              as: 'item',
              cond: {
                $eq: ['$$item.answer', '$data.answer'],
              },
            },
          },
        },
        count: {
          $sum: 1,
        },
      })
      .unwind({
        path: '$_id.answer',
      })
      .addFields({
        '_id.answer.count': '$count',
        '_id.answer.percent': {
          $multiply: [
            {
              $divide: ['$count', '$_id.total'],
            },
            100,
          ],
        },
      })
      .group({
        _id: {
          surveyId: '$_id.surveyId',
          question: '$_id.question',
          date: '$_id.date',
        },
        answers: {
          $push: '$_id.answer',
        },
      })
      .project({
        _id: 0,
        surveyId: '$_id.surveyId',
        question: '$_id.question',
        date: '$_id.date',
        answers: '$answers',
      })
      .build();

    const surveyResult = await surveyCollection.aggregate(query).toArray();

    return surveyResult.length ? surveyResult[0] : null;
  }
}
