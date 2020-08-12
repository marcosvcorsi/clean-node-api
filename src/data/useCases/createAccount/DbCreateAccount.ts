import {
  Encrypter,
  CreateAccount,
  CreateAccountModel,
  AccountModel,
  CreateAccountRepository,
} from './DbCreateAccountProtocols';

export default class DbCreateAccount implements CreateAccount {
  private readonly encrypter: Encrypter;

  private readonly createAccountRepository: CreateAccountRepository;

  constructor(
    encrypter: Encrypter,
    createAccountRepository: CreateAccountRepository,
  ) {
    this.encrypter = encrypter;
    this.createAccountRepository = createAccountRepository;
  }

  async create(accountData: CreateAccountModel): Promise<AccountModel> {
    const hashedPassword = await this.encrypter.encrypt(accountData.password);

    const account = await this.createAccountRepository.create({
      ...accountData,
      password: hashedPassword,
    });

    return account;
  }
}
