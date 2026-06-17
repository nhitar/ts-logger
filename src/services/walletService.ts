import { DatabaseResponse } from '../common/interfaces/databaseResponseInterface';
import {
  WalletBalanceWithId,
  WalletWithId,
} from '../common/interfaces/walletInterface';
import database from '../database/database';

export const getAllWallets = async () => {
  return (await database.all('SELECT * FROM wallets', [])) as WalletWithId[];
};

export const getBalancesByWalletId = async (walletId: number) => {
  return (await database.all(
    'SELECT * FROM wallet_currencies WHERE wallet_id = ?',
    [walletId],
  )) as WalletBalanceWithId[];
};

export const getWalletById = async (id: number) => {
  return (await database.get('SELECT * FROM wallets WHERE id = ?', [
    id,
  ])) as WalletWithId;
};

export const createWallet = async (address: string) => {
  const response: DatabaseResponse = await database.run(
    'INSERT INTO wallets (address) VALUES (?)',
    [address],
  );
  return response.lastID;
};

export const buyCurrency = async (
  walletId: number,
  currencyId: number,
  balance: number,
) => {
  const response: DatabaseResponse = await database.run(
    'INSERT INTO wallet_currencies (wallet_id, currency_id, amount) VALUES (?, ?, ?)',
    [walletId, currencyId, balance],
  );
  return response.lastID;
};

export const updateWallet = async (id: number, address: string) => {
  const response: DatabaseResponse = await database.run(
    'UPDATE wallets SET address = ? WHERE id = ?',
    [address, id],
  );
  return response.changes;
};

export const updateWalletBalance = async (
  walletId: number,
  currencyId: number,
  amount: number,
) => {
  const response: DatabaseResponse = await database.run(
    'UPDATE wallet_currencies SET amount = ? WHERE wallet_id = ? AND currency_id = ?',
    [amount, walletId, currencyId],
  );
  return response.changes;
};

export const deleteWallet = async (id: number) => {
  const response: DatabaseResponse = await database.run(
    'DELETE FROM wallets WHERE id = ?',
    [id],
  );
  return response.changes;
};
