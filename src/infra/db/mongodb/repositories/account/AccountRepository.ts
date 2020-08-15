import { CreateAccountRepository } from '../../../../../data/protocols/CreateAccountRepository';
import { CreateAccountModel } from '../../../../../domain/useCases/CreateAccount';
import { AccountModel } from '../../../../../domain/models/Account';
import { MongoHelper } from '../../helpers/mongoHelper';

export class AccountMongoRepository implements CreateAccountRepository {
  async create(accountData: CreateAccountModel): Promise<AccountModel> {
    const accountCollection = await MongoHelper.getCollection('accounts');

    const result = await accountCollection.insertOne(accountData);

    const [account] = result.ops;

    return MongoHelper.map<AccountModel>(account);
  }
}
