import {
  Hasher,
  CreateAccount,
  CreateAccountModel,
  AccountModel,
  CreateAccountRepository,
} from './DbCreateAccountProtocols';

export default class DbCreateAccount implements CreateAccount {
  constructor(
    private readonly hasher: Hasher,
    private readonly createAccountRepository: CreateAccountRepository,
  ) {}

  async create(accountData: CreateAccountModel): Promise<AccountModel> {
    const hashedPassword = await this.hasher.hash(accountData.password);

    const account = await this.createAccountRepository.create({
      ...accountData,
      password: hashedPassword,
    });

    return account;
  }
}
