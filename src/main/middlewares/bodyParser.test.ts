import request from 'supertest';
import app from '../config/app';

describe('BodyParser middleware test', () => {
  it('should parse body as json', async () => {
    app.post('/test-body-parser', (req, res) => {
      res.send(req.body);
    });

    const response = await request(app).post('/test-body-parser').send({
      name: 'anyname',
    });

    expect(response.body).toEqual({
      name: 'anyname',
    });
  });
});
