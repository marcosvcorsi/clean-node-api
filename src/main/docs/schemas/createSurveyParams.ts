export const createSurveySchema = {
  type: 'object',
  properties: {
    question: {
      type: 'string',
    },
    answers: {
      type: 'array',
      items: {
        $ref: '#/schemas/surveyAnswer',
      },
    },
  },
};
