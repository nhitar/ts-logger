import express from 'express';

import * as authController from '../controllers/authController';
import * as currencyController from '../controllers/currencyController';
import * as statusController from '../controllers/statusController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/auth/login', authController.login);

router.get('/status', statusController.getStatus);

router.get('/currencies', authMiddleware, currencyController.getAllCurrencies);
router.get(
  '/currencies/:id',
  authMiddleware,
  currencyController.getCurrencyById,
);
router.post('/currencies', authMiddleware, currencyController.createCurrency);
router.put(
  '/currencies/:id',
  authMiddleware,
  currencyController.updateCurrency,
);
router.delete(
  '/currencies/:id',
  authMiddleware,
  currencyController.deleteCurrency,
);

router.get('/price', authMiddleware, currencyController.getTickerPrice);

export default router;
