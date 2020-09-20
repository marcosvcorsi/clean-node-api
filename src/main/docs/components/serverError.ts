export const serverError = {
  description: 'Erro no servidor',
  content: {
    'application/json': {
      schema: {
        $ref: '#/schemas/error',
      },
    },
  },
};
