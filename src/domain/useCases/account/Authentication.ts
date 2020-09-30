import { AuthenticationModel } from '@/domain/models/Authentication';

export type AuthenticationParams = {
  email: string;
  password: string;
};

export interface Authentication {
  auth(authentication: AuthenticationParams): Promise<AuthenticationModel>;
}
