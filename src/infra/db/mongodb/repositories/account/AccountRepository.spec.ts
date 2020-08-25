import { Collection } from 'mongodb';
import { MongoHelper } from '../../helpers/mongoHelper';
import { AccountMongoRepository } from './AccountRepository';

let accountCollection: Collection;

describe('Account MongoDB Repository', () => {
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

  const makeSut = (): AccountMongoRepository => {
    return new AccountMongoRepository();
  };

  it('should return an account on add success', async () => {
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

  it('should return an account on loadByEmail success', async () => {
    const sut = makeSut();

    await accountCollection.insertOne({
      name: 'anyname',
      email: 'anyemail@mail.com',
      password: 'anypassword',
    });

    const account = await sut.loadByEmail('anyemail@mail.com');

    expect(account).toBeTruthy();
    expect(account.id).toBeTruthy();
    expect(account.name).toBe('anyname');
    expect(account.email).toBe('anyemail@mail.com');
    expect(account.password).toBe('anypassword');
  });

  it('should return null if loadByEmail fails', async () => {
    const sut = makeSut();

    const account = await sut.loadByEmail('anyemail@mail.com');

    expect(account).toBeFalsy();
  });
});
