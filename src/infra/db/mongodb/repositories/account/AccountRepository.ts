import { CreateAccountRepository } from '../../../../../data/protocols/db/CreateAccountRepository';
import { CreateAccountModel } from '../../../../../domain/useCases/CreateAccount';
import { AccountModel } from '../../../../../domain/models/Account';
import { MongoHelper } from '../../helpers/mongoHelper';
import { LoadAccountByEmailRepository } from '../../../../../data/protocols/db/LoadAccountByEmailRepository';

export class AccountMongoRepository
  implements CreateAccountRepository, LoadAccountByEmailRepository {
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
}
