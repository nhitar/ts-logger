import { Request, Response } from 'express';

import {
  WalletBalanceWithId,
  WalletWithId,
} from '../common/interfaces/walletInterface';
import * as walletService from '../services/walletService';

export const getAllWalletsController = async (_: Request, res: Response) => {
  try {
    const wallets: WalletWithId[] = await walletService.getAllWallets();
    res.status(200).json(wallets);
  } catch (error) {
    const errorMessage = (error as Error).message;
    res
      .status(400)
      .json({ message: `Bad get wallets request: '${errorMessage}'.` });
  }
};

export const getWalletByIdController = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const wallet = await walletService.getWalletById(id);
    if (wallet === undefined) {
      return res.status(404).json({ message: 'Wallet not found.' });
    }
    res.status(200).json(wallet);
  } catch (error) {
    const errorMessage = (error as Error).message;
    res
      .status(400)
      .json({ message: `Bad get wallet by id request: '${errorMessage}'.` });
  }
};

export const getWalletCurrenciesController = async (
  req: Request,
  res: Response,
) => {
  try {
    const walletId = Number(req.params.id);
    const currencies = await walletService.getBalanceByWalletId(walletId);
    if (currencies === undefined) {
      return res.status(404).json({ message: 'Wallet not found.' });
    }
    res.status(200).json(currencies);
  } catch (error) {
    const errorMessage = (error as Error).message;
    res
      .status(400)
      .json({
        message: `Bad get wallet currencies request: '${errorMessage}'.`,
      });
  }
};

export const createWalletController = async (req: Request, res: Response) => {
  try {
    const wallets: WalletWithId[] = await walletService.getAllWallets();
    if (wallets.find((wallet) => wallet.address === req.body.address)) {
      return res
        .status(409)
        .json({ message: 'Wallet with this address already exists.' });
    }

    const id = await walletService.createWallet(req.body.address);
    const wallet = await walletService.getWalletById(id);
    if (wallet === undefined) {
      return res.status(404).json({ message: 'Wallet not found.' });
    }

    res.status(201).json(wallet);
  } catch (error) {
    const errorMessage = (error as Error).message;
    res
      .status(400)
      .json({ message: `Bad request for wallet create: '${errorMessage}'.` });
  }
};

export const updateWalletController = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    const changes = await walletService.updateWallet(id, req.body.address);
    const wallet = await walletService.getWalletById(id);
    if (changes === 0 || wallet === undefined) {
      return res.status(404).json({ message: 'Wallet not found.' });
    }

    res.status(200).json(wallet);
  } catch (error) {
    const errorMessage = (error as Error).message;
    res
      .status(400)
      .json({ message: `Bad request for update wallet: '${errorMessage}'.` });
  }
};

export const buyCurrencyController = async (req: Request, res: Response) => {
  try {
    const walletId = Number(req.params.id);
    const currencyId = Number(req.body.currencyId);
    const amount = Number(req.body.amount);
    const walletCurrencies: WalletBalanceWithId[] =
      await walletService.getBalanceByWalletId(walletId);
    if (walletCurrencies === undefined) {
      return res.status(404).json({ message: 'Wallet not found.' });
    }

    const existingCurrencies = walletCurrencies.find(
      (balance) => balance.currency_id === currencyId,
    );
    if (existingCurrencies) {
      await walletService.updateWalletBalance(
        walletId,
        currencyId,
        existingCurrencies.amount + amount,
      );
    } else {
      await walletService.buyCurrency(walletId, currencyId, amount);
    }

    const updatedBalance = await walletService.getBalanceByWalletId(walletId);
    res.status(200).json(updatedBalance);
  } catch (error) {
    const errorMessage = (error as Error).message;
    res
      .status(400)
      .json({ message: `Bad request for buy currency: '${errorMessage}'.` });
  }
};

export const deleteWalletController = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const changes = await walletService.deleteWallet(id);
    if (changes === 0) {
      return res.status(404).json({ message: 'Wallet not found.' });
    }
    res.status(204).end();
  } catch (error) {
    const errorMessage = (error as Error).message;
    res
      .status(400)
      .json({ message: `Bad request for delete wallet: '${errorMessage}'.` });
  }
};
