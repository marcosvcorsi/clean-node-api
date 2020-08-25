import { AccountModel } from '../../../domain/models/Account';

export interface LoadAccountByEmailRepository {
  loadByEmail(email: string): Promise<AccountModel>;
}
