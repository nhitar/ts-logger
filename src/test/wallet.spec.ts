import request from 'supertest';

import { WalletWithId } from '../common/interfaces/walletInterface';
import { app, databaseReady, server } from '../main';

describe('WalletService', () => {
  let authToken = '';
  let allWallets: WalletWithId[] = [];
  let databaseDump: WalletWithId[] = [];

  const wallets = [
    {
      address: 'ABC123',
    },
    {
      address: 'DEF456',
    },
  ];

  const saveDatabase = async () => {
    const getAllResponse = await request(app)
      .get('/wallets')
      .set('Authorization', `Bearer ${authToken}`);
    databaseDump = getAllResponse.body;
  };

  const restoreDatabase = async () => {
    await clearDatabase();
    for (const wallet of databaseDump) {
      await request(app)
        .post('/wallets')
        .set('Authorization', `Bearer ${authToken}`)
        .send(wallet);
    }
  };

  const clearDatabase = async () => {
    const getAllResponse = await request(app)
      .get('/wallets')
      .set('Authorization', `Bearer ${authToken}`);

    for (const wallet of getAllResponse.body) {
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

    for (let i = 0; i < wallets.length; ++i) {
      await request(app)
        .post('/wallets')
        .set('Authorization', `Bearer ${authToken}`)
        .send(wallets[i]);
    }

    const response = await request(app)
      .get('/wallets')
      .set('Authorization', `Bearer ${authToken}`);

    allWallets = response.body;
  });

  it('should return all wallets', async () => {
    const response = await request(app)
      .get('/wallets')
      .set('Authorization', `Bearer ${authToken}`);

    expect(response.body).toMatchObject([
      { address: 'ABC123' },
      { address: 'DEF456' },
    ]);
    expect(response.statusCode).toBe(200);
  });

  it('should return wallet by id', async () => {
    const targetWallet = allWallets.find(
      (wallet) => wallet.address === 'ABC123',
    );

    const response = await request(app)
      .get(`/wallets/${targetWallet!.id}`)
      .set('Authorization', `Bearer ${authToken}`);

    expect(response.body).toEqual(
      expect.objectContaining({
        address: 'ABC123',
      }),
    );
    expect(response.statusCode).toBe(200);
  });

  it('should not return wallet by id', async () => {
    const response = await request(app)
      .get(`/wallets/${-1}`)
      .set('Authorization', `Bearer ${authToken}`);

    expect(response.body).toEqual({ message: 'Wallet not found.' });
    expect(response.statusCode).toBe(404);
  });

  it('should create wallet', async () => {
    const newWallet = { address: 'GHI789' };
    const response = await request(app)
      .post('/wallets')
      .set('Authorization', `Bearer ${authToken}`)
      .send(newWallet);

    expect(response.body).toMatchObject({
      address: 'GHI789',
    });
    expect(response.statusCode).toBe(201);

    const updatedWallets = await request(app)
      .get('/wallets')
      .set('Authorization', `Bearer ${authToken}`);

    expect(updatedWallets.body).toEqual(
      expect.arrayContaining([expect.objectContaining({ address: 'GHI789' })]),
    );
  });

  it('should not create wallet', async () => {
    const newWallet = { address: 'ABC123' };
    const response = await request(app)
      .post('/wallets')
      .set('Authorization', `Bearer ${authToken}`)
      .send(newWallet);

    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toContain(
      'Wallet with this address already exists.',
    );
    expect(response.statusCode).toBe(409);
  });

  it('should update wallet', async () => {
    const targetWallet = allWallets.find(
      (wallet) => wallet.address === 'ABC123',
    );

    const updatedWallet = { address: 'AAA111' };
    const response = await request(app)
      .put(`/wallets/${targetWallet!.id}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send(updatedWallet);

    expect(response.body).toMatchObject({
      address: 'AAA111',
    });
    expect(response.statusCode).toBe(200);

    const updated = await request(app)
      .get(`/wallets/${targetWallet!.id}`)
      .set('Authorization', `Bearer ${authToken}`);

    expect(updated.body).toEqual(
      expect.objectContaining({ address: 'AAA111' }),
    );
  });

  it('should not update wallet', async () => {
    const targetWallet = allWallets.find(
      (wallet) => wallet.address === 'ABC123',
    );

    const updatedWallet = {};
    const response = await request(app)
      .put(`/wallets/${targetWallet!.id}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send(updatedWallet);

    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toContain('Bad request for update wallet');
    expect(response.statusCode).toBe(400);
  });

  it('should delete wallet', async () => {
    const targetWallet = allWallets.find(
      (wallet) => wallet.address === 'ABC123',
    );

    const response = await request(app)
      .delete(`/wallets/${targetWallet!.id}`)
      .set('Authorization', `Bearer ${authToken}`);

    expect(response.statusCode).toBe(204);

    const deleted = await request(app)
      .get(`/wallets/${targetWallet!.id}`)
      .set('Authorization', `Bearer ${authToken}`);

    expect(deleted.statusCode).toBe(404);
  });

  it('should not delete wallet', async () => {
    const response = await request(app)
      .delete(`/wallets/${-1}`)
      .set('Authorization', `Bearer ${authToken}`);

    expect(response.body).toEqual({ message: 'Wallet not found.' });
    expect(response.statusCode).toBe(404);
  });

  afterAll(async () => {
    jest.restoreAllMocks();
    await restoreDatabase();
    await new Promise<void>((resolve) => server.close(() => resolve()));
  });
});
