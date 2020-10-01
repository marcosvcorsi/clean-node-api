import { AccountModel } from '@/domain/models/Account';
import { mockCreateSurveyParams } from '@/domain/test';
import { Collection } from 'mongodb';
import { MongoHelper } from '../../helpers/mongoHelper';
import { SurveyMongoRepository } from './SurveyMongoRepository';

let surveyCollection: Collection;
let accountCollection: Collection;
let surveyResultCollection: Collection;

const mockAccount = async (): Promise<AccountModel> => {
  const res = await accountCollection.insertOne({
    name: 'anyname',
    email: 'anyemail@mail.com',
    password: 'anypassword',
  });

  const [account] = res.ops;

  return MongoHelper.map(account);
};

const makeSut = (): SurveyMongoRepository => {
  return new SurveyMongoRepository();
};

describe('Survey MongoDB Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL);
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  beforeEach(async () => {
    surveyResultCollection = await MongoHelper.getCollection('survey_results');
    surveyCollection = await MongoHelper.getCollection('surveys');
    accountCollection = await MongoHelper.getCollection('accounts');

    await surveyResultCollection.deleteMany({});
    await surveyCollection.deleteMany({});
    await accountCollection.deleteMany({});
  });

  describe('create()', () => {
    it('should insert a new survey', async () => {
      const sut = makeSut();

      await sut.create(mockCreateSurveyParams());

      const survey = await surveyCollection.findOne({
        question: 'anyquestion',
      });

      expect(survey).toBeTruthy();
    });
  });

  describe('loadAll()', () => {
    it('should load all surveys on success', async () => {
      const account = await mockAccount();

      const result = await surveyCollection.insertMany([
        {
          question: 'anyquestion',
          answers: [
            {
              image: 'anyimage',
              answer: 'anyanswer',
            },
          ],
        },

        {
          question: 'otherquestion',
          answers: [
            {
              answer: 'otheranswer',
            },
          ],
        },
      ]);

      const {
        _id: surveyId,
        answers: [answer],
      } = result.ops[0];

      await surveyResultCollection.insertOne({
        accountId: account.id,
        surveyId,
        answer,
        date: new Date(),
      });

      const sut = makeSut();

      const surveys = await sut.loadAll(account.id);

      expect(surveys.length).toBe(2);
      expect(surveys[0].id).toBeTruthy();
      expect(surveys[0].question).toBe('anyquestion');
      expect(surveys[0].didAnswer).toBe(true);
      expect(surveys[1].id).toBeTruthy();
      expect(surveys[1].question).toBe('otherquestion');
      expect(surveys[1].didAnswer).toBe(false);
    });

    it('should load empty list', async () => {
      const account = await mockAccount();

      const sut = makeSut();

      const surveys = await sut.loadAll(account.id);

      expect(surveys.length).toBe(0);
    });
  });

  describe('loadById()', () => {
    it('should load survey by id on success', async () => {
      const res = await surveyCollection.insertOne({
        question: 'anyquestion',
        answers: [
          {
            image: 'anyimage',
            answer: 'anyanswer',
          },
        ],
      });

      const [{ _id: id }] = res.ops;

      const sut = makeSut();

      const survey = await sut.loadById(id);

      expect(survey).toBeTruthy();
      expect(survey.id).toBeTruthy();
    });
  });
});
