import { Collection } from 'mongodb';
import { MongoHelper } from '../../helpers/mongoHelper';
import { LogMongoRepository } from './LogRepository';

describe('Log MongoDB Repository', () => {
  let errorCollection: Collection;

  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL);
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  beforeEach(async () => {
    errorCollection = await MongoHelper.getCollection('errors');

    await errorCollection.deleteMany({});
  });

  it('shoud create an error log on success', async () => {
    const sut = new LogMongoRepository();

    await sut.logError('anyerror');

    const count = await errorCollection.countDocuments();
    expect(count).toBe(1);
  });
});
