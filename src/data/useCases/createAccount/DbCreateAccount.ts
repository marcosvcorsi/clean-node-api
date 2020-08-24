import {
  Hasher,
  CreateAccount,
  CreateAccountModel,
  AccountModel,
  CreateAccountRepository,
} from './DbCreateAccountProtocols';

export default class DbCreateAccount implements CreateAccount {
  private readonly hasher: Hasher;

  private readonly createAccountRepository: CreateAccountRepository;

  constructor(
    hasher: Hasher,
    createAccountRepository: CreateAccountRepository,
  ) {
    this.hasher = hasher;
    this.createAccountRepository = createAccountRepository;
  }

  async create(accountData: CreateAccountModel): Promise<AccountModel> {
    const hashedPassword = await this.hasher.hash(accountData.password);

    const account = await this.createAccountRepository.create({
      ...accountData,
      password: hashedPassword,
    });

    return account;
  }
}
