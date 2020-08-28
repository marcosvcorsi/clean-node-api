import request from 'supertest';
import { Collection } from 'mongodb';
import { hash } from 'bcrypt';

import app from '../config/app';
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongoHelper';

let accountCollection: Collection;

describe('Login Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL);
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  beforeEach(async () => {
    accountCollection = await MongoHelper.getCollection('accounts');

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

  describe('POST /login', () => {
    it('should return a token on login', async () => {
      const password = await hash('anypassword', 12);

      await accountCollection.insertOne({
        name: 'anyname',
        email: 'anymail@mail.com.br',
        password,
      });

      await request(app)
        .post('/api/login')
        .send({
          email: 'anymail@mail.com.br',
          password: 'anypassword',
        })
        .expect(200);
    });
  });
});
