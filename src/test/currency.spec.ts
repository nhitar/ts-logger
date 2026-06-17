import request from 'supertest';

import { CurrencyWithId } from '../common/interfaces/currencyInterface';
import { app, databaseReady, server } from '../main';

describe('CurrencyService', () => {
  let authToken = '';
  let allCurrencies: CurrencyWithId[] = [];
  let databaseDump: CurrencyWithId[] = [];

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

  const saveDatabase = async () => {
    const getAllResponse = await request(app)
      .get('/currencies')
      .set('Authorization', `Bearer ${authToken}`);
    databaseDump = getAllResponse.body;
  };

  const restoreDatabase = async () => {
    await clearDatabase();
    for (const currency of databaseDump) {
      await request(app)
        .post('/currencies')
        .set('Authorization', `Bearer ${authToken}`)
        .send(currency);
    }
  };

  const clearDatabase = async () => {
    const getAllResponse = await request(app)
      .get('/currencies')
      .set('Authorization', `Bearer ${authToken}`);

    for (const currency of getAllResponse.body) {
      await request(app)
        .delete(`/currencies/${currency.id}`)
        .set('Authorization', `Bearer ${authToken}`);
    }
  };

  beforeAll(async () => {
    jest.spyOn(console, 'log').mockImplementation(() => {});
    await databaseReady;

    const user = {
      email: 'user@example.com',
      password: 'password',
    };

    const response = await request(app).post('/auth/login').send(user);
    authToken = response.body.token;

    await saveDatabase();
  });

  beforeEach(async () => {
    await clearDatabase();

    for (let i = 0; i < currencies.length; ++i) {
      await request(app)
        .post('/currencies')
        .set('Authorization', `Bearer ${authToken}`)
        .send(currencies[i]);
    }

    const response = await request(app)
      .get('/currencies')
      .set('Authorization', `Bearer ${authToken}`);

    allCurrencies = response.body;
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

  it('should return blockchain height', async () => {
    const response = await request(app)
      .get('/currencies/height')
      .set('Authorization', `Bearer ${authToken}`);

    expect(response.body).toHaveProperty('height');
    expect(Number(response.body.height)).toBeGreaterThan(0);
    expect(response.statusCode).toBe(200);
  });

  it('should return currency by id', async () => {
    const targetCurrency = allCurrencies.find(
      (currency: { ticker: string }) => currency.ticker === 'ABC',
    );

    const response = await request(app)
      .get(`/currencies/${targetCurrency!.id}`)
      .set('Authorization', `Bearer ${authToken}`);

    expect(response.body).toEqual(
      expect.objectContaining({
        name: 'ticker-1',
        ticker: 'ABC',
        price: 10,
      }),
    );
    expect(response.statusCode).toBe(200);
  });

  it('should not return currency by id', async () => {
    const response = await request(app)
      .get(`/currencies/${-1}`)
      .set('Authorization', `Bearer ${authToken}`);

    expect(response.body).toEqual({ message: 'Currency not found.' });
    expect(response.statusCode).toBe(404);
  });

  it('should create currency', async () => {
    const newCurrency = { name: 'ticker-3', ticker: 'GHI', price: 30 };
    const response = await request(app)
      .post('/currencies')
      .set('Authorization', `Bearer ${authToken}`)
      .send(newCurrency);

    expect(response.body).toMatchObject({
      name: 'ticker-3',
      ticker: 'GHI',
      price: 30,
    });
    expect(response.statusCode).toBe(201);

    const updatedCurrencies = await request(app)
      .get('/currencies')
      .set('Authorization', `Bearer ${authToken}`);

    expect(updatedCurrencies.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: 'ticker-3', ticker: 'GHI', price: 30 }),
      ]),
    );
  });

  it('should not create currency', async () => {
    const newCurrency = { name: 'ticker-3', ticker: 'GHI' };
    const response = await request(app)
      .post('/currencies')
      .set('Authorization', `Bearer ${authToken}`)
      .send(newCurrency);

    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toContain('Bad request for currency create');
    expect(response.statusCode).toBe(400);
  });

  it('should update currency', async () => {
    const targetCurrency = allCurrencies.find(
      (currency: { ticker: string }) => currency.ticker === 'ABC',
    );

    const updatedCurrency = { name: 'ticker-1', ticker: 'ABC', price: 100 };
    const response = await request(app)
      .put(`/currencies/${targetCurrency!.id}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send(updatedCurrency);

    expect(response.body).toMatchObject({
      name: 'ticker-1',
      ticker: 'ABC',
      price: 100,
    });
    expect(response.statusCode).toBe(200);

    const updated = await request(app)
      .get(`/currencies/${targetCurrency!.id}`)
      .set('Authorization', `Bearer ${authToken}`);

    expect(updated.body).toEqual(
      expect.objectContaining({ name: 'ticker-1', ticker: 'ABC', price: 100 }),
    );
  });

  it('should not update currency', async () => {
    const targetCurrency = allCurrencies.find(
      (currency: { ticker: string }) => currency.ticker === 'ABC',
    );

    const updatedCurrency = { name: 'ticker-1', ticker: 'ABC' };
    const response = await request(app)
      .put(`/currencies/${targetCurrency!.id}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send(updatedCurrency);

    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toContain('Bad request for update currency');
    expect(response.statusCode).toBe(400);
  });

  it('should delete currency', async () => {
    const targetCurrency = allCurrencies.find(
      (currency: { ticker: string }) => currency.ticker === 'ABC',
    );

    const response = await request(app)
      .delete(`/currencies/${targetCurrency!.id}`)
      .set('Authorization', `Bearer ${authToken}`);

    expect(response.statusCode).toBe(204);

    const deleted = await request(app)
      .get(`/currencies/${targetCurrency!.id}`)
      .set('Authorization', `Bearer ${authToken}`);

    expect(deleted.statusCode).toBe(404);
  });

  it('should not delete currency', async () => {
    const response = await request(app)
      .delete(`/currencies/${-1}`)
      .set('Authorization', `Bearer ${authToken}`);

    expect(response.body).toEqual({ message: 'Currency not found.' });
    expect(response.statusCode).toBe(404);
  });

  afterAll(async () => {
    jest.restoreAllMocks();
    await restoreDatabase();
    await new Promise<void>((resolve) => server.close(() => resolve()));
  });
});
