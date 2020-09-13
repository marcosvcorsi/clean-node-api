import request from 'supertest';
import app from '../config/app';

import { MongoHelper } from '../../infra/db/mongodb/helpers/mongoHelper';

describe('Survey Result Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL);
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  describe('POST /surveys/:surveyId/results', () => {
    it('should not save survey result on put without authorization', async () => {
      await request(app)
        .put('/api/surveys/anyid/results')
        .send({
          answer: 'anyanswer',
        })
        .expect(403);
    });
  });
});
