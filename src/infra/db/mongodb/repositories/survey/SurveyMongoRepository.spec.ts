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

  describe('loadAll()', () => {
    it('should load all surveys on success', async () => {
      await surveyCollection.insertMany([
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

      const sut = makeSut();

      const surveys = await sut.loadAll();

      expect(surveys.length).toBe(2);
      expect(surveys[0].question).toBe('anyquestion');
      expect(surveys[1].question).toBe('otherquestion');
    });
  });
});
