import express from 'express';

import * as walletController from '../controllers/walletController';
import { authMiddleware } from '../middleware/authMiddleware';

const walletRouter = express.Router();

walletRouter.get('/', authMiddleware, walletController.getAllWalletsController);

walletRouter.post('/', authMiddleware, walletController.createWalletController);
walletRouter.post(
  '/:id/buy',
  authMiddleware,
  walletController.buyCurrencyController,
);
walletRouter.put(
  '/:id',
  authMiddleware,
  walletController.updateWalletController,
);
walletRouter.delete(
  '/:id',
  authMiddleware,
  walletController.deleteWalletController,
);

export default walletRouter;
