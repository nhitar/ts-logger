import request from 'supertest';

import { app, server } from '../main';

describe('Status endpoint', () => {
  it('should return ok status', async () => {
    const response = await request(app).get('/status');
    expect(response.body).toEqual({ message: 'ok' });
    expect(response.statusCode).toBe(200);
  });

  afterAll((done) => {
    server.close(done);
  });
});
