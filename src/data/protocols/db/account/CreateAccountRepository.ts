import { CreateAccountParams } from '@/domain/useCases/account/CreateAccount';
import { AccountModel } from '@/domain/models/Account';

export interface CreateAccountRepository {
  create(accountData: CreateAccountParams): Promise<AccountModel>;
}
