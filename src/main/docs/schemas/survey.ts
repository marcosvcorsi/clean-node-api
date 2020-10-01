export const surveySchema = {
  type: 'object',
  properties: {
    id: {
      type: 'string',
    },
    question: {
      type: 'string',
    },
    date: {
      type: 'string',
    },
    answers: {
      type: 'array',
      items: {
        $ref: '#/schemas/surveyAnswer',
      },
    },
    didAnswer: {
      type: 'boolean',
    },
  },
};
