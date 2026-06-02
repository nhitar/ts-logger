import { Currency } from '../common/interfaces/currencyInterface';
import database from '../database/database';

export const getAllCurrencies = async () => {
  return await database.all('SELECT * FROM currencies', []);
};

export const getCurrencyById = async (id: number) => {
  return await database.get('SELECT * FROM currencies WHERE id = ?', [id]);
};

export const getCurrencyByTicker = async (ticker: string) => {
  return await database.get('SELECT * FROM currencies WHERE ticker = ?', [
    ticker,
  ]);
};

export const createCurrency = async (currency: Currency) => {
  await database.run(
    'INSERT INTO currencies (name, ticker, price) VALUES (?, ?, ?)',
    [currency.name, currency.ticker, currency.price],
  );
};

export const updateCurrency = async (id: number, currency: Currency) => {
  await database.run(
    'UPDATE currencies SET name = ?, ticker = ?, price = ? WHERE id = ?',
    [currency.name, currency.ticker, currency.price, id],
  );
};

export const deleteCurrency = async (id: number) => {
  await database.run('DELETE FROM currencies WHERE id = ?', [id]);
};
