import axios from 'axios';
import { Request, Response } from 'express';

import { ExternalApiFieldsError } from '../common/errors/externalApiFieldsError';
import {
  Currency,
  CurrencyWithId,
} from '../common/interfaces/currencyInterface';
import { log } from '../core/logger';
import * as currencyService from '../services/currencyService';

export const getAllCurrenciesController = async (_: Request, res: Response) => {
  try {
    const currencies: CurrencyWithId[] =
      await currencyService.getAllCurrencies();
    res.status(200).json(currencies);
  } catch {
    res.status(400).json({ message: 'Bad get currencies request.' });
  }
};

export const getCurrencyByIdController = async (
  req: Request,
  res: Response,
) => {
  try {
    const id = Number(req.params.id);
    const currency = await currencyService.getCurrencyById(id);
    if (currency === undefined) {
      return res.status(404).json({ message: 'Currency not found.' });
    }
    res.status(200).json(currency);
  } catch {
    res.status(400).json({ message: 'Bad get currency by id request.' });
  }
};

export const createCurrencyController = async (req: Request, res: Response) => {
  try {
    const newCurrency: Currency = {
      name: req.body.name,
      ticker: req.body.ticker,
      price: Number(req.body.price),
    };

    const id = await currencyService.createCurrency(newCurrency);
    const currency = await currencyService.getCurrencyById(id);
    if (currency === undefined) {
      return res.status(404).json({ message: 'Currency not found.' });
    }
    res.status(201).json(currency);
  } catch {
    res.status(400).json({ message: 'Bad request for currency create.' });
  }
};

export const updateCurrencyController = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const updatedCurrency: Currency = {
      name: req.body.name,
      ticker: req.body.ticker,
      price: Number(req.body.price),
    };

    const changes = await currencyService.updateCurrency(id, updatedCurrency);
    const currency = await currencyService.getCurrencyById(id);
    if (changes === 0 || currency === undefined) {
      return res.status(404).json({ message: 'Currency not found.' });
    }
    res.status(200).json(currency);
  } catch {
    res.status(400).json({ message: 'Bad request for update currency.' });
  }
};

export const deleteCurrencyController = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const changes = await currencyService.deleteCurrency(id);
    if (changes === 0) {
      return res.status(404).json({ message: 'Currency not found.' });
    }
    res.status(204).end();
  } catch {
    res.status(400).json({ message: 'Bad delete currency request.' });
  }
};

const getCurrencyPrices = async () => {
  for (let attempt = 1; attempt <= 5; ++attempt) {
    try {
      const response = await axios.get(
        `https://api.binance.com/api/v3/ticker/price`,
        { timeout: 3000 },
      );
      const data = response.data;
      return data;
    } catch (error) {
      log('WARN', `Error while accessing external API. Attempt: ${attempt}.`);
      if (error instanceof ExternalApiFieldsError) {
        throw new ExternalApiFieldsError('Wrong format of parsed data.');
      }
      if (axios.isAxiosError(error)) {
        log('WARN', `External API error: ${error}.`);
      }
    }
  }
  throw new Error('External service unavailable.');
};

export const updateCurrencyPrices = async () => {
  try {
    const currencyPrices: [] = await getCurrencyPrices();
    const currencies: CurrencyWithId[] =
      await currencyService.getAllCurrencies();
    for (const currency of currencies) {
      const externalTicker = currencyPrices.find(
        (ticker) => ticker['symbol'] === currency.ticker,
      );
      if (externalTicker) {
        await currencyService.updateCurrency(currency.id, {
          name: currency.name,
          ticker: currency.ticker,
          price: Number(externalTicker['price']),
        });
      }
    }
  } catch (error) {
    log('ERROR', `Error while updating currency prices: ${error}.`);
  }
};

export const getTickerPricesController = async (
  req: Request,
  res: Response,
) => {
  const ticker = req.query.ticker as string;
  if (ticker === undefined) {
    return res.status(400).json({ message: 'Ticker is missing in query.' });
  }

  const currencies: CurrencyWithId[] =
    await currencyService.getCurrenciesByTicker(ticker);
  if (currencies.length === 0) {
    return res.status(404).json({
      message: `Currency with ticker ${ticker} is missing in storage.`,
    });
  }

  res.status(200).json(currencies);
};
