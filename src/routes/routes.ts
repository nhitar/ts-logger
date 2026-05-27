import express from 'express';

import * as currencyService from '../services/currencyService';
import * as statusService from '../services/statusService';

const router = express.Router();

router.get('/status', statusService.getStatus);

router.get('/currencies', currencyService.getAllCurrency);
router.get('/currencies/:id', currencyService.getCurrencyById);
router.post('/currencies', currencyService.createCurrency);
router.put('/currencies/:id', currencyService.updateCurrency);
router.delete('/currencies/:id', currencyService.deleteCurrency);

export default router;
