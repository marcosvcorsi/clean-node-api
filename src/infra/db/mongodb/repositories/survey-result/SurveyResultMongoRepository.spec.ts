import { AccountModel } from '@/domain/models/Account';
import { SurveyModel } from '@/domain/models/Survey';
import { Collection, ObjectId } from 'mongodb';
import { MongoHelper } from '../../helpers/mongoHelper';
import { SurveyResultMongoRepository } from './SurveyResultMongoRepository';

let accountCollection: Collection;
let surveyCollection: Collection;
let surveyResultCollection: Collection;

const makeSut = (): SurveyResultMongoRepository => {
  return new SurveyResultMongoRepository();
};

const makeSurvey = async (): Promise<SurveyModel> => {
  const res = await surveyCollection.insertOne({
    question: 'anyquestion',
    answers: [
      { answer: 'anyanswer', image: 'anyimage' },
      { answer: 'anyanswer2' },
      { answer: 'anyanswer3' },
    ],
    date: new Date(),
  });

  const [survey] = res.ops;

  return MongoHelper.map(survey);
};

const makeAccount = async (): Promise<AccountModel> => {
  const res = await accountCollection.insertOne({
    name: 'anyname',
    email: 'anyemail@mail.com',
    password: 'anypassword',
  });

  const [account] = res.ops;

  return MongoHelper.map(account);
};

describe('SurveyResultMongoRepository Test', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL);
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  beforeEach(async () => {
    accountCollection = await MongoHelper.getCollection('accounts');
    surveyCollection = await MongoHelper.getCollection('surveys');
    surveyResultCollection = await MongoHelper.getCollection('survey_results');

    await surveyResultCollection.deleteMany({});
    await surveyCollection.deleteMany({});
    await accountCollection.deleteMany({});
  });

  describe('save()', () => {
    it('should create a survey result if not exists', async () => {
      const survey = await makeSurvey();

      const { id: surveyId, answers } = survey;

      const [{ answer }] = answers;

      const account = await makeAccount();

      const { id: accountId } = account;

      const sut = makeSut();

      await sut.save({
        surveyId,
        accountId,
        answer,
        date: new Date(),
      });

      const surveyResult = await surveyResultCollection.findOne({
        surveyId,
        accountId,
      });

      expect(surveyResult).toBeTruthy();
    });

    it('should update a survey result if exists', async () => {
      const survey = await makeSurvey();

      const { id: surveyId, answers } = survey;

      const [{ answer }, { answer: otherAnswer }] = answers;

      const account = await makeAccount();

      const { id: accountId } = account;

      await surveyResultCollection.insertOne({
        surveyId: new ObjectId(surveyId),
        accountId: new ObjectId(accountId),
        answer,
        date: new Date(),
      });

      const sut = makeSut();

      await sut.save({
        surveyId,
        accountId,
        answer: otherAnswer,
        date: new Date(),
      });

      const results = await surveyResultCollection
        .find({
          surveyId,
          accountId,
        })
        .toArray();

      expect(results).toHaveLength(1);
    });
  });

  describe('loadBySurveyId()', () => {
    it('should load survey result by survey id', async () => {
      const survey = await makeSurvey();

      const { id: surveyId, answers } = survey;

      const [{ answer }] = answers;

      const account = await makeAccount();

      const otherAccount = await makeAccount();

      const { id: accountId } = account;

      await surveyResultCollection.insertMany([
        {
          surveyId: new ObjectId(surveyId),
          accountId: new ObjectId(accountId),
          answer,
          date: new Date(),
        },

        {
          surveyId: new ObjectId(surveyId),
          accountId: new ObjectId(otherAccount.id),
          answer,
          date: new Date(),
        },
      ]);

      const sut = makeSut();

      const response = await sut.loadBySurveyId(surveyId, accountId);

      expect(response).toBeTruthy();
      expect(response.surveyId).toEqual(survey.id);

      expect(response.answers[0].count).toBe(2);
      expect(response.answers[0].percent).toBe(100);
      expect(response.answers[0].isCurrentAccountAnswer).toBe(true);

      expect(response.answers[1].count).toBe(0);
      expect(response.answers[1].percent).toBe(0);
      expect(response.answers[1].isCurrentAccountAnswer).toBe(false);
    });

    it('should return null if survey result does not exists', async () => {
      const survey = await makeSurvey();
      const account = await makeAccount();

      const { id: surveyId } = survey;

      const sut = makeSut();

      const response = await sut.loadBySurveyId(surveyId, account.id);

      expect(response).toBeNull();
    });
  });
});
