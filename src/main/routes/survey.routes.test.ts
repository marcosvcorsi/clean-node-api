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

describe('Survey Routes', () => {
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

  describe('POST /surveys', () => {
    it('should not create survey on post without authorization', async () => {
      await request(app)
        .post('/api/surveys')
        .send({
          question: 'Question 1',
          answers: [
            { image: 'http://image.com.br/image.jpg', answer: 'Answer 1' },
            { answer: 'Answer 2' },
          ],
        })
        .expect(403);
    });

    it('should create survey on post with valid token', async () => {
      const accessToken = await makeAccessToken();

      await request(app)
        .post('/api/surveys')
        .set('Authorization', accessToken)
        .send({
          question: 'Question 1',
          answers: [
            { image: 'http://image.com.br/image.jpg', answer: 'Answer 1' },
            { answer: 'Answer 2' },
          ],
        })
        .expect(204);
    });
  });

  describe('GET /surveys', () => {
    it('should not list surveys on get without authorization', async () => {
      await request(app).get('/api/surveys').expect(403);
    });

    it('should list surveys with valid authorization', async () => {
      const accessToken = await makeAccessToken();

      await request(app)
        .get('/api/surveys')
        .set('Authorization', accessToken)
        .expect(204);
    });
  });
});
