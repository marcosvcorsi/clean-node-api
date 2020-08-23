import { CreateAccountModel } from '../../../domain/useCases/CreateAccount';
import { AccountModel } from '../../../domain/models/Account';

export interface CreateAccountRepository {
  create(accountData: CreateAccountModel): Promise<AccountModel>;
}
