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
      expect(surveys[0].id).toBeTruthy();
      expect(surveys[0].question).toBe('anyquestion');
      expect(surveys[1].id).toBeTruthy();
      expect(surveys[1].question).toBe('otherquestion');
    });

    it('should load empty list', async () => {
      const sut = makeSut();

      const surveys = await sut.loadAll();

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
