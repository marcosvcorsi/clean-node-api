import {
  Encrypter,
  CreateAccount,
  CreateAccountModel,
  AccountModel,
} from './DbCreateAccountProtocols';

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
