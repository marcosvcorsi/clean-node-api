import request from 'supertest';
import app from '../config/app';

import { MongoHelper } from '../../infra/db/mongodb/helpers/mongoHelper';

describe('Login Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL);
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  beforeEach(async () => {
    const accountCollection = await MongoHelper.getCollection('accounts');

    await accountCollection.deleteMany({});
  });

  describe('POST /signup', () => {
    it('should return an account on signup', async () => {
      await request(app)
        .post('/api/signup')
        .send({
          name: 'anyname',
          email: 'anymail@mail.com.br',
          password: 'anypassword',
          passwordConfirmation: 'anypassword',
        })
        .expect(201);
    });
  });
});
