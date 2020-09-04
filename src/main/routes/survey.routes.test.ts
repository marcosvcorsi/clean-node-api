import request from 'supertest';
import { Collection } from 'mongodb';

import app from '../config/app';
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongoHelper';

let surveyCollection: Collection;

describe('Survey Routes', () => {
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

  describe('POST /survey', () => {
    it('should create survey on post', async () => {
      await request(app)
        .post('/api/survey')
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
});
