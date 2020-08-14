import request from 'supertest';
import app from '../config/app';

describe('Content-type middleware test', () => {
  it('should return default Content-type as json', async () => {
    app.get('/test-content-type', (req, res) => {
      res.send();
    });

    await request(app)
      .get('/test-content-type')
      .expect('content-type', /json/gi);
  });

  it('should return xml Content-type when forced', async () => {
    app.get('/test-content-type-xml', (req, res) => {
      res.type('xml');
      res.send();
    });

    await request(app)
      .get('/test-content-type-xml')
      .expect('content-type', /xml/gi);
  });
});
