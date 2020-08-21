import { AccountModel } from '../../domain/models/Account';

export interface LoadAccountByEmailRepository {
  load(email: string): Promise<AccountModel>;
}
