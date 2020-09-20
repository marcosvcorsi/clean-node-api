import {
  badRequest,
  serverError,
  unauthorized,
  notFound,
  forbidden,
} from './components/';
import { apiKeyAuthSchema } from './schemas/';

export default {
  securitySchemes: {
    apiKeyAuth: apiKeyAuthSchema,
  },
  badRequest,
  unauthorized,
  forbidden,
  notFound,
  serverError,
};
