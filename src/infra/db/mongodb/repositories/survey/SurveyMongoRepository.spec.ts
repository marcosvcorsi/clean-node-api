import { Collection } from 'mongodb';
import { MongoHelper } from '../../helpers/mongoHelper';
import { SurveyMongoRepository } from './SurveyMongoRepository';

let surveyCollection: Collection;

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
    surveyCollection = await MongoHelper.getCollection('surveys');

    await surveyCollection.deleteMany({});
  });

  describe('create()', () => {
    it('should insert a new survey', async () => {
      const sut = makeSut();

      await sut.create({
        question: 'anyquestion',
        answers: [
          { answer: 'anyanswer', image: 'anyimage' },
          { answer: 'otheranswer' },
        ],
        date: new Date(),
      });

      const survey = await surveyCollection.findOne({
        question: 'anyquestion',
      });

      expect(survey).toBeTruthy();
    });
  });

  describe('loadAll()', () => {});
});
