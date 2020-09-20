import request from 'supertest';
import { Collection } from 'mongodb';
import { sign } from 'jsonwebtoken';
import app from '../config/app';

import { MongoHelper } from '../../infra/db/mongodb/helpers/mongoHelper';

import authConfig from '../config/auth';

let surveyCollection: Collection;
let accountCollection: Collection;

const makeAccessToken = async (): Promise<string> => {
  const res = await accountCollection.insertOne({
    name: 'anyname',
    email: 'anymail@mail.com.br',
    password: 'anypassword',
    role: 'admin',
  });

  const [{ _id: id }] = res.ops;

  const accessToken = await sign({ id }, authConfig.secret);

  await accountCollection.updateOne(
    { _id: id },
    {
      $set: {
        accessToken,
      },
    },
  );

  return accessToken;
};

describe('Survey Result Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL);
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection('surveys');
    accountCollection = await MongoHelper.getCollection('accounts');

    await surveyCollection.deleteMany({});
    await accountCollection.deleteMany({});
  });

  describe('PUT /surveys/:surveyId/results', () => {
    it('should not save survey result on put without authorization', async () => {
      await request(app)
        .put('/api/surveys/anyid/results')
        .send({
          answer: 'anyanswer',
        })
        .expect(403);
    });

    it('should save survey result on put with authorization', async () => {
      const res = await surveyCollection.insertOne({
        question: 'Question 1',
        answers: [
          { image: 'http://image.com.br/image.jpg', answer: 'Answer 1' },
          { answer: 'Answer 2' },
        ],
        date: new Date(),
      });

      const [{ _id: surveyId }] = res.ops;

      const accessToken = await makeAccessToken();

      await request(app)
        .put(`/api/surveys/${surveyId}/results`)
        .set('Authorization', accessToken)
        .send({
          answer: 'Answer 1',
        })
        .expect(200);
    });
  });

  describe('GET /surveys/:surveyId/results', () => {
    it('should not get survey result on put without authorization', async () => {
      await request(app).get('/api/surveys/anyid/results').expect(403);
    });
  });
});
