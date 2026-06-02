import express from 'express';

import * as authController from '../controllers/authController';
import * as currencyController from '../controllers/currencyController';
import * as statusController from '../controllers/statusController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/auth/login', authController.login);

router.get('/status', statusController.getStatusController);

router.get(
  '/currencies',
  authMiddleware,
  currencyController.getAllCurrenciesController,
);
router.get(
  '/currencies/:id',
  authMiddleware,
  currencyController.getCurrencyByIdController,
);
router.post(
  '/currencies',
  authMiddleware,
  currencyController.createCurrencyController,
);
router.put(
  '/currencies/:id',
  authMiddleware,
  currencyController.updateCurrencyController,
);
router.delete(
  '/currencies/:id',
  authMiddleware,
  currencyController.deleteCurrencyController,
);

router.get(
  '/price',
  authMiddleware,
  currencyController.getTickerPriceController,
);

export default router;
