import round from 'mongo-round';
import { LoadSurveyResultRepository } from '@/data/protocols/db/survey-result/LoadSurveyResultRepository';
import { SaveSurveyResultRepository } from '@/data/protocols/db/survey-result/SaveSurveyResultRepository';
import { SurveyResultModel } from '@/domain/models/SurveyResult';
import { SaveSurveyResultParams } from '@/domain/useCases/survey-result/SaveSurveyResult';
import { ObjectId } from 'mongodb';
import { MongoHelper } from '../../helpers/mongoHelper';
import { QueryBuilder } from '../../helpers/queryBuilder';

export class SurveyResultMongoRepository
  implements SaveSurveyResultRepository, LoadSurveyResultRepository {
  async save(surveyData: SaveSurveyResultParams): Promise<void> {
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
  }

  async loadBySurveyId(
    surveyId: string,
    accountId: string,
  ): Promise<SurveyResultModel> {
    const surveyResultCollection = await MongoHelper.getCollection(
      'survey_results',
    );

    const query = new QueryBuilder()
      .match({
        surveyId: new ObjectId(surveyId),
      })
      .group({
        _id: 0,
        data: {
          $push: '$$ROOT',
        },
        total: {
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
          total: '$total',
          answer: '$data.answer',
          answers: '$survey.answers',
        },
        count: {
          $sum: 1,
        },
        currentAccountAnswer: {
          $push: {
            $cond: [
              { $eq: ['$data.accountId', accountId] },
              '$data.answer',
              '$invalid',
            ],
          },
        },
      })
      .project({
        _id: 0,
        surveyId: '$_id.surveyId',
        question: '$_id.question',
        date: '$_id.date',
        answers: {
          $map: {
            input: '$_id.answers',
            as: 'item',
            in: {
              $mergeObjects: [
                '$$item',
                {
                  count: {
                    $cond: {
                      if: {
                        $eq: ['$$item.answer', '$_id.answer'],
                      },
                      then: '$count',
                      else: 0,
                    },
                  },
                  percent: {
                    $cond: {
                      if: {
                        $eq: ['$$item.answer', '$_id.answer'],
                      },
                      then: {
                        $multiply: [
                          {
                            $divide: ['$count', '$_id.total'],
                          },
                          100,
                        ],
                      },
                      else: 0,
                    },
                  },
                  isCurrentAccountAnswer: {
                    $eq: [
                      '$$item.answer',
                      { $arrayElemAt: ['$currentAccountAnswer', 0] },
                    ],
                  },
                },
              ],
            },
          },
        },
      })
      .group({
        _id: {
          surveyId: '$surveyId',
          question: '$question',
          date: '$date',
        },
        answers: {
          $push: '$answers',
        },
      })
      .project({
        _id: 0,
        surveyId: '$_id.surveyId',
        question: '$_id.question',
        date: '$_id.date',
        answers: {
          $reduce: {
            input: '$answers',
            initialValue: [],
            in: {
              $concatArrays: ['$$value', '$$this'],
            },
          },
        },
      })
      .unwind({
        path: '$answers',
      })
      .group({
        _id: {
          surveyId: '$surveyId',
          question: '$question',
          date: '$date',
          answer: '$answers.answer',
          image: '$answers.image',
          isCurrentAccountAnswer: '$answers.isCurrentAccountAnswer',
        },
        count: {
          $sum: '$answers.count',
        },
        percent: {
          $sum: '$answers.percent',
        },
      })
      .project({
        _id: 0,
        surveyId: '$_id.surveyId',
        question: '$_id.question',
        date: '$_id.date',
        answer: {
          answer: '$_id.answer',
          image: '$_id.image',
          count: round('$count'),
          percent: round('$percent'),
          isCurrentAccountAnswer: '$_id.isCurrentAccountAnswer',
        },
      })
      .sort({
        'answer.count': -1,
      })
      .group({
        _id: {
          surveyId: '$surveyId',
          question: '$question',
          date: '$date',
        },
        answers: {
          $push: '$answer',
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
    const surveyResult = await surveyResultCollection
      .aggregate(query)
      .toArray();
    return surveyResult.length ? surveyResult[0] : null;
  }
}
