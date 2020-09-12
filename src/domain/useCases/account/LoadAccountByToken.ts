import { AccountModel } from '../../models/Account';

export interface LoadAccountByToken {
  load(token: string, role?: string): Promise<AccountModel>;
}
