import { AccountModel } from '@/domain/models/Account';

export interface LoadAccountByTokenRepository {
  loadByToken(token: string, role?: string): Promise<AccountModel>;
}
