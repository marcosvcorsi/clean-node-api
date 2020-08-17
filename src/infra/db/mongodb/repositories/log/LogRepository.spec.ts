import { Collection } from 'mongodb';
import { MongoHelper } from '../../helpers/mongoHelper';
import { LogMongoRepository } from './LogRepository';

const makeSut = (): LogMongoRepository => {
  return new LogMongoRepository();
};

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
    const sut = makeSut();

    await sut.logError('anyerror');

    const count = await errorCollection.countDocuments();
    expect(count).toBe(1);
  });
});
