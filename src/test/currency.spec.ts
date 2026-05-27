import request from 'supertest';

import { app, server } from '../main';

describe('CurrencyService', () => {
  let authToken = '';

  const currencies = [
    {
      name: 'ticker-1',
      ticker: 'ABC',
      price: 10,
    },
    {
      name: 'ticker-2',
      ticker: 'DEF',
      price: 20,
    },
  ];

  beforeAll(async () => {
    const user = {
      email: 'user@example.com',
      password: 'password',
    };

    const response = await request(app).post('/auth/login').send(user);
    authToken = response.body.token;
  });

  beforeEach(async () => {
    const getAllResponse = await request(app)
      .get('/currencies')
      .set('Authorization', `Bearer ${authToken}`);
    for (const currency of getAllResponse.body) {
      await request(app)
        .delete(`/currencies/${currency.id}`)
        .set('Authorization', `Bearer ${authToken}`);
    }

    for (let i = 0; i < currencies.length; ++i) {
      await request(app)
        .post('/currencies')
        .set('Authorization', `Bearer ${authToken}`)
        .send(currencies[i]);
    }
  });

  it('should return all currencies', async () => {
    const response = await request(app)
      .get('/currencies')
      .set('Authorization', `Bearer ${authToken}`);

    expect(response.body).toMatchObject([
      { name: 'ticker-1', ticker: 'ABC', price: 10 },
      { name: 'ticker-2', ticker: 'DEF', price: 20 },
    ]);
    expect(response.statusCode).toBe(200);
  });

  it('should return currency by id', async () => {
    const response = await request(app)
      .get('/currencies/0')
      .set('Authorization', `Bearer ${authToken}`);

    expect(response.body).toMatchObject({
      id: 0,
      name: 'ticker-1',
      ticker: 'ABC',
      price: 10,
    });
    expect(response.statusCode).toBe(200);
  });

  it('should create currency', async () => {
    const newCurrency = { name: 'ticker-3', ticker: 'GHI', price: 30 };
    const response = await request(app)
      .post('/currencies')
      .set('Authorization', `Bearer ${authToken}`)
      .send(newCurrency);

    expect(response.body).toMatchObject({
      id: 2,
      name: 'ticker-3',
      ticker: 'GHI',
      price: 30,
    });
    expect(response.statusCode).toBe(201);
  });

  it('should update currency', async () => {
    const updatedCurrency = { name: 'ticker-1', ticker: 'ABC', price: 100 };
    const response = await request(app)
      .put('/currencies/0')
      .set('Authorization', `Bearer ${authToken}`)
      .send(updatedCurrency);

    expect(response.body).toMatchObject({
      id: 0,
      name: 'ticker-1',
      ticker: 'ABC',
      price: 100,
    });
    expect(response.statusCode).toBe(200);
  });

  it('should delete currency', async () => {
    const response = await request(app)
      .delete('/currencies/0')
      .set('Authorization', `Bearer ${authToken}`);

    expect(response.statusCode).toBe(204);
  });

  afterAll((done) => {
    server.close(done);
  });
});
