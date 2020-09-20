export const surveyResultSchema = {
  type: 'object',
  properties: {
    surveyId: {
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
        $ref: '#/schemas/surveyResultAnswer',
      },
    },
  },
};
