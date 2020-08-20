import {
  HttpRequest,
  HttpResponse,
  Controller,
  CreateAccount,
  Validation,
} from './SignUpProtocols';

import {
  badRequest,
  serverError,
  created,
} from '../../helpers/http/httpHelper';

export default class SignUpController implements Controller {
  private readonly createAccount: CreateAccount;

  private readonly validation: Validation;

  constructor(createAccount: CreateAccount, validation: Validation) {
    this.createAccount = createAccount;
    this.validation = validation;
  }

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const validationError = this.validation.validate(httpRequest.body);

      if (validationError) {
        return badRequest(validationError);
      }

      const { name, email, password } = httpRequest.body;

      const account = await this.createAccount.create({
        name,
        email,
        password,
      });

      return created(account);
    } catch (error) {
      return serverError(error);
    }
  }
}
