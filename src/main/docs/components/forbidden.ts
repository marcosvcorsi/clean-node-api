export const forbidden = {
  description: 'Operação não permitida',
  content: {
    'application/json': {
      schema: {
        $ref: '#/schemas/error',
      },
    },
  },
};
