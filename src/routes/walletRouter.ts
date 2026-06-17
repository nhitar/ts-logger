import express from 'express';

import * as walletController from '../controllers/walletController';
import { authMiddleware } from '../middleware/authMiddleware';

const walletRouter = express.Router();

walletRouter.get('/', authMiddleware, walletController.getAllWalletsController);

walletRouter.get(
  '/:id',
  authMiddleware,
  walletController.getWalletByIdController,
);

walletRouter.get(
  '/:id/currencies',
  authMiddleware,
  walletController.getWalletCurrenciesController,
);

walletRouter.post('/', authMiddleware, walletController.createWalletController);

walletRouter.put(
  '/:id',
  authMiddleware,
  walletController.updateWalletController,
);

walletRouter.put(
  '/:id/balance',
  authMiddleware,
  walletController.updateWalletBalanceController,
);

walletRouter.delete(
  '/:id',
  authMiddleware,
  walletController.deleteWalletController,
);

export default walletRouter;
