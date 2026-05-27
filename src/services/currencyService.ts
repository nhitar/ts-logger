import { Request, Response } from 'express';

interface Currency {
  id: number;
  name: string;
  ticker: number;
}

const currencies: Currency[] = [];

export const getStatus = async (_: Request, res: Response) => {
  res.status(200).json({ message: 'ok' });
};

export const getAllCurrency = async (_: Request, res: Response) => {
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
