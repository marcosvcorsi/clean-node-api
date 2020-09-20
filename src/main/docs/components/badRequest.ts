export const badRequest = {
  description: 'Requisição Inválida',
  content: {
    'application/json': {
      schema: {
        $ref: '#/schemas/error',
      },
    },
  },
};
