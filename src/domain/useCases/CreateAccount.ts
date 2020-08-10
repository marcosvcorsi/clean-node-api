import AccountModel from '../models/Account';

export interface CreateAccountModel {
  name: string;
  email: string;
  password: string;
}

export default interface CreateAccount {
  create(account: CreateAccountModel): AccountModel;
}
