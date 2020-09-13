import { AccountModel } from '@/domain/models/Account';
import { SurveyModel } from '@/domain/models/Survey';
import { Collection } from 'mongodb';
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
      { answer: 'otheranswer' },
    ],
    date: new Date(),
  });

  const [survey] = res.ops;

  return survey;
};

const makeAccount = async (): Promise<AccountModel> => {
  const res = await accountCollection.insertOne({
    name: 'anyname',
    email: 'anyemail@mail.com',
    password: 'anypassword',
  });

  const [account] = res.ops;

  return account;
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

      const response = await sut.save({
        surveyId,
        accountId,
        answer,
        date: new Date(),
      });

      expect(response).toBeTruthy();
      expect(response.id).toBeTruthy();
      expect(response.answer).toBe(answer);
    });

    it('should update a survey result if exists', async () => {
      const survey = await makeSurvey();

      const { id: surveyId, answers } = survey;

      const [{ answer }, { answer: otherAnswer }] = answers;

      const account = await makeAccount();

      const { id: accountId } = account;

      const res = await surveyResultCollection.insertOne({
        surveyId,
        accountId,
        answer,
        date: new Date(),
      });

      const [{ _id: id }] = res.ops;

      const sut = makeSut();

      const response = await sut.save({
        surveyId,
        accountId,
        answer: otherAnswer,
        date: new Date(),
      });

      expect(response).toBeTruthy();
      expect(response.id).toEqual(id);
      expect(response.answer).toBe(otherAnswer);
    });
  });
});