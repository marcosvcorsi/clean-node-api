import { HttpResponse } from '../protocols/http';
import { ServerError } from '../errors';

export const badRequest = (error: Error): HttpResponse => ({
  statusCode: 400,
  body: error,
});

export const serverError = (): HttpResponse => {
  return {
    statusCode: 500,
    body: new ServerError(),
  };
};

export const created = (data): HttpResponse => {
  return {
    statusCode: 201,
    body: data,
  };
};
