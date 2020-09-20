export const surveysPath = {
  get: {
    security: [
      {
        apiKeyAuth: [],
      },
    ],
    tags: ['Enquetes'],
    summary: 'Rota de listagem de enquetes',
    responses: {
      200: {
        description: 'Sucesso',
        content: {
          'application/json': {
            schema: {
              $ref: '#/schemas/surveys',
            },
          },
        },
      },
      403: {
        $ref: '#/components/forbidden',
      },
      404: {
        $ref: '#/components/notFound',
      },
      500: {
        $ref: '#/components/serverError',
      },
    },
  },

  post: {
    security: [
      {
        apiKeyAuth: [],
      },
    ],
    tags: ['Enquetes'],
    summary: 'Rota de criação de uma nova enquete',
    requestBody: {
      content: {
        'application/json': {
          schema: {
            $ref: '#/schemas/createSurveyParams',
          },
        },
      },
    },
    responses: {
      204: {
        description: 'Sucesso',
      },
      403: {
        $ref: '#/components/forbidden',
      },
      500: {
        $ref: '#/components/serverError',
      },
    },
  },
};
