import { AccountModel } from '../models/Account';

export interface CreateAccountModel {
  name: string;
  email: string;
  password: string;
}

export interface CreateAccount {
  create(account: CreateAccountModel): Promise<AccountModel>;
}
