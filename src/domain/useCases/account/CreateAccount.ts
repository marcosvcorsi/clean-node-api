import { AccountModel } from '../../models/Account';

export type CreateAccountParams = Omit<AccountModel, 'id'>;

export interface CreateAccount {
  create(account: CreateAccountParams): Promise<AccountModel>;
}
