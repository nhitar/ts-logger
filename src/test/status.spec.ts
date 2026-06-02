import request from 'supertest';

import { app, databaseReady, server } from '../main';

describe('Status endpoint', () => {
  beforeAll(async () => {
    await databaseReady;
  });

  it('should return ok status', async () => {
    const response = await request(app).get('/status');
    expect(response.body).toEqual({ message: 'ok' });
    expect(response.statusCode).toBe(200);
  });

  afterAll((done) => {
    server.close(done);
  });
});
