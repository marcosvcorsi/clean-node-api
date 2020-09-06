import { Collection } from 'mongodb';
import { MongoHelper } from '../../helpers/mongoHelper';
import { AccountMongoRepository } from './AccountMongoRepository';

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

  it('should return an account on loadByToken success without role', async () => {
    const sut = makeSut();

    await accountCollection.insertOne({
      name: 'anyname',
      email: 'anyemail@mail.com',
      password: 'anypassword',
      accessToken: 'anytoken',
    });

    const account = await sut.loadByToken('anytoken');

    expect(account).toBeTruthy();
    expect(account.id).toBeTruthy();
    expect(account.name).toBe('anyname');
    expect(account.email).toBe('anyemail@mail.com');
    expect(account.password).toBe('anypassword');
  });

  it('should return an account on loadByToken success with role', async () => {
    const sut = makeSut();

    await accountCollection.insertOne({
      name: 'anyname',
      email: 'anyemail@mail.com',
      password: 'anypassword',
      accessToken: 'anytoken',
      role: 'anyrole',
    });

    const account = await sut.loadByToken('anytoken', 'anyrole');

    expect(account).toBeTruthy();
    expect(account.id).toBeTruthy();
    expect(account.name).toBe('anyname');
    expect(account.email).toBe('anyemail@mail.com');
    expect(account.password).toBe('anypassword');
  });

  it('should return null if loadByToken fails', async () => {
    const sut = makeSut();

    const account = await sut.loadByToken('anytoken', 'anyrole');

    expect(account).toBeFalsy();
  });

  it('should return null if loadByEmail fails', async () => {
    const sut = makeSut();

    const account = await sut.loadByEmail('anyemail@mail.com');

    expect(account).toBeFalsy();
  });

  it('should update account access token', async () => {
    const sut = makeSut();

    const data = await accountCollection.insertOne({
      name: 'anyname',
      email: 'anyemail@mail.com',
      password: 'anypassword',
    });

    const [{ _id: id, accessToken }] = data.ops;

    expect(accessToken).toBeFalsy();

    await sut.updateAccessToken(id, 'anytoken');

    const account = await accountCollection.findOne({ _id: id });

    expect(account).toBeTruthy();
    expect(account.accessToken).toBe('anytoken');
  });
});
