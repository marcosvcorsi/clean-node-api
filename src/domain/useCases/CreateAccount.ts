import { AccountModel } from '../models/Account';

export type CreateAccountModel = Omit<AccountModel, 'id'>;

export interface CreateAccount {
  create(account: CreateAccountModel): Promise<AccountModel>;
}
