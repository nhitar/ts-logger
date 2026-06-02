import axios from 'axios';
import { Request, Response } from 'express';

import { ExternalApiFieldsError } from '../common/errors/externalApiFieldsError';
import { Currency } from '../common/interfaces/currencyInterface';
import { log } from '../core/logger';

const currencies: Currency[] = [];

export const getAllCurrencies = async (_: Request, res: Response) => {
  res.status(200).json(currencies);
};

export const getCurrencyById = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const currency = currencies.find((currency) => currency.id === id);
  if (!currency) {
    return res.status(404).json({ message: 'Currency not found.' });
  }

  res.status(200).json(currency);
};

export const createCurrency = async (req: Request, res: Response) => {
  try {
    const newCurrency: Currency = {
      id: currencies.length,
      name: req.body.name,
      ticker: req.body.ticker,
      price: req.body.price,
    };
    currencies.push(newCurrency);
    res.status(201).json(newCurrency);
  } catch {
    res.status(400).json({ message: 'Bad request for currency create.' });
  }
};

export const updateCurrency = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const index = currencies.findIndex((currency) => currency.id === id);

    if (index === -1) {
      return res.status(404).json({ message: 'Currency not found.' });
    }

    const updatedCurrency: Currency = {
      id: id,
      name: req.body.name,
      ticker: req.body.ticker,
      price: req.body.price,
    };

    currencies[index] = updatedCurrency;
    res.status(200).json(updatedCurrency);
  } catch {
    res.status(400).json({ message: 'Bad request for update currency.' });
  }
};

export const deleteCurrency = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const index = currencies.findIndex((currency) => currency.id === id);

    if (index === -1) {
      return res.status(404).json({ message: 'Currency not found.' });
    }

    currencies.splice(index, 1);
    res.status(204).json({ message: 'Currency deleted.' });
  } catch {
    res.status(400).json({ message: 'Bad update currency request.' });
  }
};

export const getTickerPrice = async (req: Request, res: Response) => {
  const ticker = String(req.query.ticker);
  if (!ticker) {
    return res.status(400).json({ message: 'Ticker is missing in query.' });
  }

  const currency = currencies.find(
    (currency) => currency.ticker.toLowerCase() === ticker.toLowerCase(),
  );
  if (!currency) {
    return res.status(404).json({
      message: `Currency with ticker ${ticker} is missing in storage.`,
    });
  }

  for (let attempt = 1; attempt <= 5; ++attempt) {
    try {
      const response = await axios.get(
        `https://api.binance.com/api/v3/ticker/price?symbol=${ticker}`,
        { timeout: 3000 },
      );
      const data = response.data;

      if (
        !data ||
        !data.hasOwnProperty('symbol') ||
        !data.hasOwnProperty('price')
      ) {
        throw new ExternalApiFieldsError('Wrong format of parsed data.');
      }
      return res.status(200).json(data);
    } catch (error) {
      log('WARN', `Error while accessing external API. Attempt: ${attempt}.`);
      if (error instanceof ExternalApiFieldsError) {
        return res.status(422).json({ message: error });
      }
      if (axios.isAxiosError(error)) {
        log('WARN', `External API error: ${error}.`);
      }
    }
  }
  res.status(503).json({ message: 'External service unavailable.' });
};
