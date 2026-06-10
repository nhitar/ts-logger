import {
  Currency,
  CurrencyWithId,
} from '../common/interfaces/currencyInterface';
import { DatabaseResponse } from '../common/interfaces/databaseResponseInterface';
import database from '../database/database';

export const getAllCurrencies = async () => {
  return (await database.all(
    'SELECT * FROM currencies',
    [],
  )) as CurrencyWithId[];
};

export const getCurrenciesByTicker = async (ticker: string) => {
  return (await database.all('SELECT * FROM currencies WHERE ticker = ?', [
    ticker,
  ])) as CurrencyWithId[];
};

export const getCurrencyById = async (id: number) => {
  return await database.get('SELECT * FROM currencies WHERE id = ?', [id]);
};

export const createCurrency = async (currency: Currency) => {
  const response: DatabaseResponse = await database.run(
    'INSERT INTO currencies (name, ticker, price) VALUES (?, ?, ?)',
    [currency.name, currency.ticker, currency.price],
  );
  return response.lastID;
};

export const updateCurrency = async (id: number, currency: Currency) => {
  const response: DatabaseResponse = await database.run(
    'UPDATE currencies SET name = ?, ticker = ?, price = ? WHERE id = ?',
    [currency.name, currency.ticker, currency.price, id],
  );
  return response.changes;
};

export const deleteCurrency = async (id: number) => {
  const response: DatabaseResponse = await database.run(
    'DELETE FROM currencies WHERE id = ?',
    [id],
  );
  return response.changes;
};
