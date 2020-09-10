import { AccountModel } from '../models/Account';

export type CreateAccountModel = {
  name: string;
  email: string;
  password: string;
};

export interface CreateAccount {
  create(account: CreateAccountModel): Promise<AccountModel>;
}
