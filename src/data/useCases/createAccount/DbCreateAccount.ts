import {
  Hasher,
  CreateAccount,
  CreateAccountModel,
  AccountModel,
  CreateAccountRepository,
  LoadAccountByEmailRepository,
} from './DbCreateAccountProtocols';

export default class DbCreateAccount implements CreateAccount {
  constructor(
    private readonly hasher: Hasher,
    private readonly createAccountRepository: CreateAccountRepository,
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
  ) {}

  async create(accountData: CreateAccountModel): Promise<AccountModel> {
    await this.loadAccountByEmailRepository.loadByEmail(accountData.email);

    const hashedPassword = await this.hasher.hash(accountData.password);

    const account = await this.createAccountRepository.create({
      ...accountData,
      password: hashedPassword,
    });

    return account;
  }
}
