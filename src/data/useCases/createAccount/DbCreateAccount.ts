import {
  CreateAccount,
  CreateAccountModel,
} from '../../../domain/useCases/CreateAccount';

import { AccountModel } from '../../../domain/models/Account';

import Encrypter from '../../protocols/Encrypter';

export default class DbCreateAccount implements CreateAccount {
  private readonly encrypter: Encrypter;

  constructor(encrypter: Encrypter) {
    this.encrypter = encrypter;
  }

  async create(account: CreateAccountModel): Promise<AccountModel> {
    await this.encrypter.encrypt(account.password);

    return Promise.resolve({ ...account, id: '1' });
  }
}
