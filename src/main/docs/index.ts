import {
  badRequest,
  serverError,
  unauthorized,
  notFound,
  forbidden,
} from './components';
import { loginPath, surveysPath } from './paths';
import {
  accountSchema,
  errorSchema,
  loginParamsSchema,
  surveyAnswerSchema,
  surveySchema,
  surveysSchema,
  apiKeyAuthSchema,
} from './schemas';

export default {
  openapi: '3.0.0',
  info: {
    title: 'Clean Node API',
    description: 'API do para realizar enquente entre programadores',
    version: '1.0.0',
  },
  license: {
    name: 'GPL-3.0-or-later',
    url: 'https://spdx.org/licenses/GPL-3.0-or-later.html',
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
    {
      name: 'Enquetes',
    },
  ],
  paths: {
    '/login': loginPath,
    '/surveys': surveysPath,
  },
  schemas: {
    account: accountSchema,
    loginParams: loginParamsSchema,
    error: errorSchema,
    survey: surveySchema,
    surveyAnswer: surveyAnswerSchema,
    surveys: surveysSchema,
  },
  components: {
    securitySchemes: {
      apiKeyAuth: apiKeyAuthSchema,
    },
    badRequest,
    unauthorized,
    forbidden,
    notFound,
    serverError,
  },
};
