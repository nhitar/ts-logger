import request from 'supertest';

import { CurrencyWithId } from '../common/interfaces/currencyInterface';
import { WalletWithId } from '../common/interfaces/walletInterface';
import { app, databaseReady, server } from '../main';

describe('WalletService', () => {
  let authToken = '';
  let allCurrencies: CurrencyWithId[] = [];
  let currencyDatabaseDump: CurrencyWithId[] = [];
  let allWallets: WalletWithId[] = [];
  let walletDatabaseDump: WalletWithId[] = [];

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

  const wallets = [
    {
      address: 'ABC123',
    },
    {
      address: 'DEF456',
    },
  ];

  const saveDatabase = async () => {
    const getAllCurrenciesResponse = await request(app)
      .get('/currencies')
      .set('Authorization', `Bearer ${authToken}`);
    currencyDatabaseDump = getAllCurrenciesResponse.body;

    const getAllWalletsResponse = await request(app)
      .get('/wallets')
      .set('Authorization', `Bearer ${authToken}`);
    walletDatabaseDump = getAllWalletsResponse.body;
  };

  const restoreDatabase = async () => {
    await clearDatabase();
    for (const currency of currencyDatabaseDump) {
      await request(app)
        .post('/currencies')
        .set('Authorization', `Bearer ${authToken}`)
        .send(currency);
    }

    for (const wallet of walletDatabaseDump) {
      await request(app)
        .post('/wallets')
        .set('Authorization', `Bearer ${authToken}`)
        .send(wallet);
    }
  };

  const clearDatabase = async () => {
    const getAllCurrenciesResponse = await request(app)
      .get('/currencies')
      .set('Authorization', `Bearer ${authToken}`);

    const getAllWalletsResponse = await request(app)
      .get('/wallets')
      .set('Authorization', `Bearer ${authToken}`);

    for (const currency of getAllCurrenciesResponse.body) {
      await request(app)
        .delete(`/currencies/${currency.id}`)
        .set('Authorization', `Bearer ${authToken}`);
    }

    for (const wallet of getAllWalletsResponse.body) {
      await request(app)
        .delete(`/wallets/${wallet.id}`)
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

    const currenciesResponse = await request(app)
      .get('/currencies')
      .set('Authorization', `Bearer ${authToken}`);

    allCurrencies = currenciesResponse.body;

    for (let i = 0; i < wallets.length; ++i) {
      await request(app)
        .post('/wallets')
        .set('Authorization', `Bearer ${authToken}`)
        .send(wallets[i]);
    }

    const walletsResponse = await request(app)
      .get('/wallets')
      .set('Authorization', `Bearer ${authToken}`);

    allWallets = walletsResponse.body;
  });

  it('should return wallet balance', async () => {
    const targetCurrency = allCurrencies.find(
      (currency) => currency.ticker === 'ABC',
    );

    const targetWallet = allWallets.find(
      (wallet) => wallet.address === 'ABC123',
    );

    await request(app)
      .put(`/wallets/${targetWallet!.id}/buy`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({ currencyId: targetCurrency!.id, amount: 10 });

    const response = await request(app)
      .get(`/wallets/${targetWallet!.id}/currencies`)
      .set('Authorization', `Bearer ${authToken}`);

    expect(response.body).toMatchObject([
      {
        id: expect.any(Number),
        walletId: targetWallet!.id,
        currencyId: targetCurrency!.id,
        amount: 10,
      },
    ]);
    expect(response.statusCode).toBe(200);
  });

  it('should not return wallet balance', async () => {
    const targetWallet = allWallets.find(
      (wallet) => wallet.address === 'ABC123',
    );

    const response = await request(app)
      .get(`/wallets/${targetWallet!.id}/currencies`)
      .set('Authorization', `Bearer ${authToken}`);

    expect(response.body).toMatchObject([]);
    expect(response.statusCode).toBe(200);
  });

  it('should buy currency', async () => {
    const targetCurrency = allCurrencies.find(
      (currency) => currency.ticker === 'ABC',
    );

    const targetWallet = allWallets.find(
      (wallet) => wallet.address === 'ABC123',
    );

    const response = await request(app)
      .put(`/wallets/${targetWallet!.id}/buy`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({ currencyId: targetCurrency!.id, amount: 10 });

    expect(response.body).toMatchObject([
      {
        id: expect.any(Number),
        walletId: targetWallet!.id,
        currencyId: targetCurrency!.id,
        amount: 10,
      },
    ]);
    expect(response.statusCode).toBe(200);
  });

  it('should not buy currency', async () => {
    const targetCurrency = allCurrencies.find(
      (currency) => currency.ticker === 'ABC',
    );

    const targetWallet = allWallets.find(
      (wallet) => wallet.address === 'ABC123',
    );

    const response = await request(app)
      .put(`/wallets/${targetWallet!.id}/buy`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({ currencyId: targetCurrency!.id, amount: -1 });

    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toContain(
      'Amount should be a positive number.',
    );
    expect(response.statusCode).toBe(400);
  });

  afterAll(async () => {
    jest.restoreAllMocks();
    await restoreDatabase();
    await new Promise<void>((resolve) => server.close(() => resolve()));
  });
});
