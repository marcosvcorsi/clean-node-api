import { HttpResponse } from '../protocols';
import { ServerError } from '../errors';

export const badRequest = (error: Error): HttpResponse => ({
  statusCode: 400,
  body: error,
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
