import express from 'express';

import * as currencyService from '../controllers/currencyController';
import * as statusService from '../controllers/statusController';

const router = express.Router();

router.get('/status', statusService.getStatus);

router.get('/currencies', currencyService.getAllCurrencies);
router.get('/currencies/:id', currencyService.getCurrencyById);
router.post('/currencies', currencyService.createCurrency);
router.put('/currencies/:id', currencyService.updateCurrency);
router.delete('/currencies/:id', currencyService.deleteCurrency);

router.get('/price', currencyService.getTickerPrice);

export default router;
