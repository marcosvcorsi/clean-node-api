import { loginPath } from './paths/login';
import { accountSchema } from './schemas/account';
import { loginParamsSchema } from './schemas/loginParams';

export default {
  openapi: '3.0.0',
  info: {
    title: 'Clean Node API',
    description: 'API do para realizar enquente entre programadores',
    version: '1.0.0',
  },
  servers: [
    {
      url: '/api',
    },
  ],
  tags: [
    {
      name: 'Login',
    },
  ],
  paths: {
    '/login': loginPath,
  },
  schemas: {
    account: accountSchema,
    loginParams: loginParamsSchema,
  },
};
