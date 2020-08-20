import { HttpResponse } from '../../protocols';
import { ServerError, UnauthorizedError } from '../../errors';

export const badRequest = (error: Error): HttpResponse => ({
  statusCode: 400,
  body: error,
});

export const unauthorized = (): HttpResponse => ({
  statusCode: 401,
  body: new UnauthorizedError(),
});

export const serverError = (error: Error): HttpResponse => {
  return {
    statusCode: 500,
    body: new ServerError(error.stack),
  };
};

export const created = (data): HttpResponse => {
  return {
    statusCode: 201,
    body: data,
  };
};

export const ok = (data): HttpResponse => {
  return {
    statusCode: 200,
    body: data,
  };
};
