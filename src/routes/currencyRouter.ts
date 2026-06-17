import express from 'express';

import * as currencyController from '../controllers/currencyController';
import { authMiddleware } from '../middleware/authMiddleware';

const currencyRouter = express.Router();

currencyRouter.get(
  '/',
  authMiddleware,
  currencyController.getAllCurrenciesController,
);

currencyRouter.get(
  '/:id',
  authMiddleware,
  currencyController.getCurrencyByIdController,
);

currencyRouter.get(
  '/:id/history',
  authMiddleware,
  currencyController.getCurrencyHistoryController,
);

currencyRouter.post(
  '/',
  authMiddleware,
  currencyController.createCurrencyController,
);

currencyRouter.put(
  '/:id',
  authMiddleware,
  currencyController.updateCurrencyController,
);

currencyRouter.delete(
  '/:id',
  authMiddleware,
  currencyController.deleteCurrencyController,
);

currencyRouter.get(
  '/price',
  authMiddleware,
  currencyController.getTickerPricesController,
);

export default currencyRouter;
