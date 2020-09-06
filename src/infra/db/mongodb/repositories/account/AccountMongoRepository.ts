import { CreateAccountRepository } from '../../../../../data/protocols/db/account/CreateAccountRepository';
import { CreateAccountModel } from '../../../../../domain/useCases/CreateAccount';
import { AccountModel } from '../../../../../domain/models/Account';
import { MongoHelper } from '../../helpers/mongoHelper';
import { LoadAccountByEmailRepository } from '../../../../../data/protocols/db/account/LoadAccountByEmailRepository';
import { UpdateAccessTokenRepository } from '../../../../../data/protocols/db/account/UpdateAccessTokenRepository';
import { LoadAccountByTokenRepository } from '../../../../../data/protocols/db/account/LoadAccountByTokenRepository';

export class AccountMongoRepository
  implements
    CreateAccountRepository,
    LoadAccountByEmailRepository,
    LoadAccountByTokenRepository,
    UpdateAccessTokenRepository {
  async loadByToken(token: string, role?: string): Promise<AccountModel> {
    const accountCollection = await MongoHelper.getCollection('accounts');

    const account = await accountCollection.findOne({
      accessToken: token,
      role,
    });

    return account ? MongoHelper.map<AccountModel>(account) : null;
  }

  async create(accountData: CreateAccountModel): Promise<AccountModel> {
    const accountCollection = await MongoHelper.getCollection('accounts');

    const result = await accountCollection.insertOne(accountData);

    const [account] = result.ops;

    return MongoHelper.map<AccountModel>(account);
  }

  async loadByEmail(email: string): Promise<AccountModel> {
    const accountCollection = await MongoHelper.getCollection('accounts');

    const account = await accountCollection.findOne({ email });

    return account ? MongoHelper.map<AccountModel>(account) : null;
  }

  async updateAccessToken(id: string, token: string): Promise<void> {
    const accountCollection = await MongoHelper.getCollection('accounts');

    await accountCollection.updateOne(
      { _id: id },
      {
        $set: {
          accessToken: token,
        },
      },
    );
  }
}
