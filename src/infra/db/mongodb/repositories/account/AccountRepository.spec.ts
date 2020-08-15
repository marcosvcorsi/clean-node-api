import { MongoHelper } from '../../helpers/mongoHelper';
import { AccountMongoRepository } from './AccountRepository';

describe('Account MongoDB Repository', () => {
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

  const makeSut = (): AccountMongoRepository => {
    return new AccountMongoRepository();
  };

  it('should return an account on success', async () => {
    const sut = makeSut();

    const account = await sut.create({
      name: 'anyname',
      email: 'anyemail@mail.com',
      password: 'anypassword',
    });

    expect(account).toBeTruthy();
    expect(account.id).toBeTruthy();
    expect(account.name).toBe('anyname');
    expect(account.email).toBe('anyemail@mail.com');
    expect(account.password).toBe('anypassword');
  });
});
